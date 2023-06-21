GOAL:
    Creates a next app with various settings for a front end

    See uses a `/<github_username/<github_repo_name>` format to pull available templates from github and copy them into new projects.

    Includes: Next.js, tailwinds css, zustand (state management)

Steps:
    1. Prompts user for full folder/path name to a folder
    2. Prompts user for paths supported by app
    3. Prompts user if a db is needed if not go to step 6
    4. If db is needed - prompts user for db name
    5. If DB is needed - prompts user for additional info
    6. Prompts user for a template for this app
    7. Creates the folder given answer to 1 by pulling github template from 6. to this folder
    8. Creates paths for all paths in 2. with index.tsx for each
    9. Creates a mongo db if 3. is true
    10. Acts on any additional info provided - eg, schemas