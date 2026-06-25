import os
import re

def replace_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # Order matters: replace longer strings first
    content = content.replace("Swarn Publication", "Swapna Publication")
    content = content.replace("SwarnPublication", "SwapnaPublication")
    content = content.replace("Swarn", "Swapna")
    content = content.replace("SWARN", "SWAPNA")

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")

def main():
    root_dir = r"c:\Users\balya\Downloads\orchids-swarn-publication-main\orchids-swarn-publication-main\frontend"
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Exclude node_modules and .next
        if 'node_modules' in dirnames:
            dirnames.remove('node_modules')
        if '.next' in dirnames:
            dirnames.remove('.next')
        
        for filename in filenames:
            if filename.endswith(('.ts', '.tsx', '.json', '.css', '.md', '.html')):
                replace_text(os.path.join(dirpath, filename))

if __name__ == "__main__":
    main()
