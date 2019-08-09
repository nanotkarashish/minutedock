#!/usr/bin/python

import os
import sys
import subprocess
from datetime import datetime


if len(sys.argv) > 4 or len(sys.argv) < 3 or (len(sys.argv) == 4 and (sys.argv[3] != "release" or "help" in sys.argv)):
    print("""usage:
    
    1. to build released changelog
    python changelog.py <from_commit_id> <to_commit_id> release
    
    2. to build unreleased changelog
    python changelog.py <from_commit_id> <to_commit_id>
    """)
    sys.exit(1)

is_release = True if len(sys.argv) == 4 and sys.argv[3] == "release" else False

# from_commit_id = "d1566cf80ea02497c9591c6c083cb8a014a1afb7"
# to_commit_id = "a09af7d75402e05b103418478a9dc7dd915e6532"

from_commit_id = sys.argv[1]
to_commit_id = sys.argv[2]
timestamp = datetime.now().strftime("%Y-%m-%d_%H.%M.%S")
version_holder = [0, 0, 0]
# generate next version from data in version.txt
try:
    with open('version.txt', "r") as version_file:
        lines = version_file.read().strip().splitlines()
        for line in lines:
            if 'MAJOR_VERSION' in line:
                values = line.split("=")
                version_holder[0] = str(int(values[1].strip()))
            if 'MINOR_VERSION' in line:
                values = line.split("=")
                version_holder[1] = str(int(values[1].strip()))
            if 'PATCH_VERSION' in line:
                values = line.split("=")
                version_holder[2] = str(int(values[1].strip()) + 1)
    version = 'v' + '.'.join(version_holder)

    # save the file back with updated PATCH_VERSION and LAST_RELEASE_VERSION
    if is_release:
        with open('version.txt', "w") as version_file:
            version_file.write("""# SPECIFY MAJOR AND MINOR VERSION FOR YOUR APPLICATION. DO NOT CHANGE THE KEYS.
MAJOR_VERSION=""" + version_holder[0] + """
MINOR_VERSION=""" + version_holder[1] + """

# DO NOT EDIT BELOW THIS LINE. THIS IS AUTOMATICALLY POPULATED BY JENKINS DURING DEPLOYMENT TO PRODUCTION
PATCH_VERSION=""" + version_holder[2] + """
LAST_RELEASE_VERSION=""" + version + """
""")

except Exception as e:
    print(e)
    print("""ERROR! version.txt file might be absent or incorrectly formatted.
Please ensure a version.txt file at root of the code with content in following format:
    
# SPECIFY MAJOR AND MINOR VERSION FOR YOUR APPLICATION. DO NOT CHANGE THE KEYS.
MAJOR_VERSION=2
MINOR_VERSION=0

# DO NOT EDIT BELOW THIS LINE. THIS IS AUTOMATICALLY POPULATED BY JENKINS DURING DEPLOYMENT TO PRODUCTION
PATCH_VERSION=1
LAST_RELEASE_VERSION=2.0.1
""")
    sys.exit(2)

# get the commit logs between two commits
git_logs_command = "git log " + from_commit_id + ".." + to_commit_id + " --pretty=format:\"%s\""
command_execution = subprocess.Popen(git_logs_command, shell=True, stdout=subprocess.PIPE)
logs_stdout = command_execution.stdout.read().decode('utf8').strip()
logs = logs_stdout.split("\n")

changelog = {}
start_commit_message_tags = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security']

# categorize the logs into above tags
for log in logs:
    if not log.strip():
        continue

    log_categorized = False
    for word in start_commit_message_tags:
        if word in log.lower():
            if word not in changelog.keys():
                changelog[word] = []
            changelog[word].append(log)
            log_categorized = True

    if not log_categorized:
        if 'others' not in changelog.keys():
            changelog['others'] = []
        changelog['others'].append(log)

# set the file name and path for changelog
changelog_folder_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'changelog')
if is_release:
    changelog_file_path = os.path.join(changelog_folder_path, 'released_' + version + "_" + timestamp + '.txt')
else:
    changelog_file_path = os.path.join(changelog_folder_path, 'unreleased.txt')

# dump the changelog to the file
if len(changelog.keys()):
    if not os.path.exists(changelog_folder_path):
        os.makedirs(changelog_folder_path)
    with open(changelog_file_path, "w+") as changelog_file:
        for word in start_commit_message_tags + ['others']:
            if word in changelog.keys():
                log_title = "[" + word.capitalize() + "]"
                print(log_title)
                changelog_file.write(log_title + "\n")
                for log in changelog[word]:
                    print(log)
                    changelog_file.write(log + "\n")
                print("\n")
                changelog_file.write("\n")

# update the tags on git
# updates the latest tag and creates a new one
if is_release:
    commands = [
        "git tag -d latest",
        "git push --delete origin latest",
        "git tag -a " + version + " " + to_commit_id + " -m \"sent to production at \"" + timestamp,
        "git tag -a latest " + to_commit_id + " -m \"sent to production at \"" + timestamp,
        "git push origin --tags"
    ]

    print("Updating tags in github")
    for cmd in commands:
        print(cmd)
        subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE).stdout.read()

commands = [
    "git add .",
    "git commit -m \"adding changelog at \"" + timestamp,
    "git push"
]
print("Adding changelog to repository")
for cmd in commands:
    print(cmd)
    subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE).stdout.read()
