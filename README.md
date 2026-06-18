# Website

| Environment | URL                                      |
| ----------- | ---------------------------------------- |
| Production  | https://seniorproject.se.rit.edu         |
| Test        | https://seniorproject-sandbox.se.rit.edu |

# Server Setup

## Add new developer to production server

Create new user account:

```batch
sudo adduser USERNAME
```

Give user administrative privileges:

```batch
sudo usermod -aG sudo username
```

_**On first login, new user must change password by using the `passwd` command**_

### Setup SSH

1. Create SSH keys (There are plenty of tutorials online to do this)
2. Create ssh folder: `mkdir /home/USERNAME/.ssh`
3. Add your public key to `/home/USERNAME/.ssh/authorized_keys` (create file if does not exist)
4. Restart ssh daemon: `sudo systemctl restart sshd`
5. Add user to pm2 group: `usermod -aG pm2 USERNAME`
6. Paste `alias pm2='env HOME=/home/website/RIT-SE-Senior-Project/server pm2'` into the bottom of `~/.bashrc`

## Install/Develop locally

- ### Using Dev Container
  - You *may* need to add the following to your hosts file (`C:\Windows\System32\drivers\etc\hosts`):
    ```
    150.171.69.10 mcr.microsoft.com
    150.171.69.10 eastus.data.mcr.microsoft.com
    ```
  - Install [Docker](https://docs.docker.com/get-docker/)
  - Install [VSCode](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  - Open the project in VSCode and select "Reopen in Container" from the command palette (Ctrl+Shift+P)
  - The project will automatically initialize and all necessary dependencies will be installed. (see `install.ps1` and `devcontainer.json`)
  - VSCode will also automatically configure the development environment, including setting up the necessary extensions and settings.

- ### Using Local Setup
  - Run `install.ps1` (recommended) or `install.bat` (legacy) or `install.sh` (on linux) to get dependencies set up locally
    - `install.ps1` supports performing a clean installation by using the `-CleanInstall` flag. Use this if you encounter a `npm install` failure. Caution: Ensure you have commited/pushed any important changes before running this command.
    - `install.ps1` also supports skipping initializing the server or the ui, using the `-SkipServer` and `-SkipUI` flags.
  - You will need to manually install the Prettier extension on your IDE ([for VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) ([for IntelliJ](https://plugins.jetbrains.com/plugin/10456-prettier)).

## Run locally

In order to get things running locally, you'll need to run `npm start ui` and `npm start server` in the root of the project.

## Deploying to production

After sshing into the server, cd into either prod or test project. Then run respective `deploy_{prod|sandbox}.sh` script

## Technical Information

- We use nginx as a reverse proxy to serve the website. Network requests for both the UI and the server go into nginx and either get redirected to the UI's static files or to endpoints on the server.

- The server is running locally using pm2.

- pm2 is a pain in the butt. If you are having issues with `.env` variables not updating, you may need to restart the pm2 daemon by using `pm2 kill` to stop the pm2 process and `pm2 start /home/website/RIT-SE-Senior-Project/server/main.js` to start it again.

- This project uses a git hook that automatically formats code before comitting. The linting is done by `prettier` and is run by `lint-staged` which only runs the linting on staged changes. `husky` is what manages the git hook.

## Project File Structure Info

- Root level (not in `/nginx`, `/server`, or `/ui`) contains files important for deployment of code onto the production and sandbox servers

- `/nginx` configuration info for the nginx server/reverse proxy

- `/server` files for the backend

  - Note that test data is stored in `/server/server/database/test_data`

- `/ui` files for the REACT based frontend

- `/test_cases` location of the comprehensive test case workflows which should be verified before deployment to ensure everything is working as expected. (see `test_cases\readme.md`)

## Backend Documentation

[Swagger Link](https://petstore.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2FRIT-Software-Engineering%2FRIT-SE-Senior-Project%2Frefs%2Fheads%2Fdev%2Fui%2Fpublic%2Fapi-docs%2Fserver_doc.yaml)


## Dependencies
### root
`ajv`: seems to be unused as a dependency in the root level. Compiles JSON schemas to JavaScript code.

`html-to-text`: converts HTML into formatted text. Unclear if this needs to be in root.

The following root dependencies are **devDependencies**:

`husky`, `lint-staged`, `prettier`. These are used for the git hook and are covered in the [Technical Information](#technical-information) section of this README document.

### server
`@google/generative-ai`: SDK that provides access to gemini, currently deprecated. Strongly consider switching to `@google/genai`. 

`cookie-parser`: reads data stored in cookies.

`cors`: handles CORS protocol.

`dotenv`: imports environment files in `server/main.js`.

`express`: web application framework that is used for routing.

`express-fileupload`: Express middleware for uploading files.

`express-session`: Express middleware for session data.

`express-validator`: Express middleware for the validator package.

`filesize-parser`: parses the size of files.

`fs-extra`: contains additional file system methods not covered by the `fs` module and allows for `fs` methods to return promises.

`html-to-text`: converts HTML into formatted text.

`memorystore`: stores sessions without leaking memory, unlike the MemoryStore in `express-session`.

`moment`: should be replaced with dayjs.

`nanoid`: creates random project and submission ids.

`node-fetch`: adds window.fetch() to Node, currently unused.

`nodemon`: automatically restarts a Node application when a file is changed, this is automatically run with the server 'start' script.

`passport`: authentication middleware for Express applications.

`passport-saml`: SAML identity provider for Passport, allows for SSO log-in.

`pdfkit`: used to generate PDF documents.

`sqlite3`: creates bindings to SQLite3 for Node, used to interact with the database.

### ui
**CodeMirror** - A rich text interface for editing code while on a website.

`@uiw/react-codemirror`: allows CodeMirror to be added as a react component.

`@uiw/codemirror-theme-eclipse`: adds theming to CodeMirror.

`@codemirror/lang-html`: adds auto-closing tags to HTML editing in CodeMirror.

**SemanticUI** - UI framework used across the entire website.

`semantic-ui-react`: provides Semantic UI React components.

`semantic-ui-css`: provides Semantic UI CSS stylization.

`@semantic-ui-react/css-patch`: patches semicolon issue with semantic (should have been fixed in an update of semanticUI?).

`@testing-library/jest-dom`: currently unused, but should be kept for use in a potential future test expansion.

`@testing-library/react`: currently only used once in `ui/src/App.test.js`. Could be used in a potential future test expansion.

`@testing-library/user-event`: currently unused, but should be kept for use in a potential future test expansion.

`ajv`: used several times as a transitive dependency for react-scripts, meaning there are multiple dependencies of react-scripts that depend on ajv. It appears to be hoisted to the top level in order to deduplicate these indirect references to it. The purpose of ajv is to compile JSON schemas into JavaScript code.

`caniuse-lite`: A transitive dependency that appears multiple times under react-scripts. Lighter version of caniuse-db. This is a tool that gives access to the data from caniuse.com (Can I use) which documents the extent to which a feature or technology is supported by various browsers.

`Moment.js` and `Day.js` are both used for handling dates and time. Using both Day.js and Moment.js is redundant as Day.js is a moment alternative.

`comma-separated-values`: used in the Admin User Editor to parse data from users uploaded as CSV data.

`dangerously-set-html-content`: is used to allow for modifiable web pages through the edited html.

`DOMpurify`: is currently only used in tooltips as a way of limiting the usable tags in the custom HTML. It is a tool to combat cross-site scripting (XSS) attacks by sanitizing strings with HTML.

`he`: is used for the decode function in order to clean up incoming strings and replace any HTML character entity references with the correct characters (for example: &trade would be replaced with ™).

`html-entities`: is used for the same thing as `he`.

`prop-types`: a tool used for validating the data types of properties. It's used inside of the component CustomItemDetail which overwrites the default item detail from react-keyed-file-browser. It's also used inside of ParsedInnerHtml which takes a string containing HTML data among other parameters as properties and outputs a JSX \<div\> containing the HTML data injected with the parameters.