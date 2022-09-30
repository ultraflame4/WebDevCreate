#! python3
import os
import sys
import shutil
import random

branch_name = os.popen("git branch --show-current").read().strip()
deploy_dir = f"build/{branch_name}"
gh_pages_branch = "build"


print("- Starting deployment of WebDevCreate")

print("Searching for dist folder...")
if not os.path.exists("dist"):
    print("dist folder not found. Please build the website first.!")
    exit(1)

os.chdir("build")
print("- Updating worktree...")
print(os.popen("git pull origin build").read())


os.chdir("..")
print(f"- Copying dist folder to {deploy_dir}")
shutil.rmtree(deploy_dir, ignore_errors=True)
shutil.copytree("./dist",deploy_dir,dirs_exist_ok=True)
os.chdir("build")
print("Finished copying of dist folder")

d_code = random.randrange(0,1000)
print(os.popen("git add .").read())
print(f"- Commiting with message 'deploy code: {d_code}'")
print(os.popen(f"git commit -m \"deploy code: {d_code}\"").read())
print(os.popen("git push origin build:build").read())

os.system("pause")
