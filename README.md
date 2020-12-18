# orvium-frontend

This is the frontend application for Orvium project.

This is a first approach to release the Orvium components in open source so they can be reusable by other teams and projects.
We should consider this as a base draft and some areas have been mocked for the first deliverable.
This means that the data changes are lost if you reload the application but you can easily change this behaviour in the code (using localstorage for example).

Thanks to this deliverable we have identified multiple areas where we need to adopt a more flexible and modular approach. We will work on making modular interfaces of the following areas:
- User Login
- File upload (could be released as independent component)
- Data services and API connection (right now it is mocked)
- Feedback component (could be released as independent component)


## Install dependencies

You need node and npm available in your system to run this code.
We recommend using something like [Node Version Manager](https://github.com/nvm-sh/nvm).

Run `npm i` to install the project dependencies.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

