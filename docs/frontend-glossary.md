# Frontend Glossary

## Open edX Frontend

The complete set of interfaces shown to a user of an Open edX instance.

## Micro-frontend

Micro-frontend is an industry standard term for small, composable, independently deployed pieces of a frontend.  It has a specific and narrower meaning in Open edX's frontend.  Open edX's decoupled frontend architecture has been called the "micro-frontend architecture" since 2018 or so, and the `frontend-app-*` repositories, specifically, are referred to as "micro-frontends" or "MFEs" for short.  They're often called "micro-frontend applications" as well.  Some might argue it's a misnomer, as many of our MFEs are quite large.  Regardless, MFEs in Open edX refer to our independently deployed, siloed frontends which do not share dependencies, and which may contain one or more distinct parts of the overall frontend.

To support a cohesive vernacular for our post-MFE architecture (The "module" architecture?), we propose co-opting "micro-frontend" and "application" to refer to a sub-type of modules - [application modules](#application-module-applications-apps).  Each of the `frontend-app-*` repositories is really a collection of related micro-frontend applications co-located in the repository together because they share code and dependencies unique to their domain.  For instance, the "learning" MFE - course outline, courseware, progress page, dates page, etc. - share a significant amount of code, but may be better thought of as a collection of related apps, not as "the learning app".

The rest of this glossary reflects the proposed usage of "application".

## Site

An independently deployed portion of the [Open edX frontend](#open-edx-frontend).  A Site renders the header, footer, and loads one or more [Modules](#module).  A frontend may consist of one Site, or multiple independent Sites, depending on an operator's needs.  Navigating between Sites involves a full-page refresh and downloading a new set of dependencies.

## Site Config

A Typescript file which represents the configuration of a [Site](#site).  It must adhere to the `SiteConfig` TypeScript interface.  It is _runtime_ code.

## Module

A piece of code that provides some specific, tightly coupled functionality, and which is loaded into a [Site](#site) via one of several loading mechanisms (either at buildtime or runtime).

There are different sub-types of modules, such as [Applications](#application-module-applications-apps), [Plugins](#plugin-module-plugins-widgets), [Services](#service-module), or [Scripts](#script-module).

### Application Module (Applications, Apps)

A sub-type of [Module](#module) that represents a logical portion of the UI of a [Site](#site).  A `frontend-app-*` repository will contain one or more application modules.

Applications are generally loaded at a path within a [Site](#site), such as `/learning` or `/profile`.  They are a specialized kind of [Module](#module) fulfilling a core function of the [Open edX frontend](#open-edx-frontend).  They are known, registered entities, and other [Modules](#module) can query the [Shell's](#shell) configuration to locate, navigate, or interact with them.

### Plugin Module (Plugins, Widgets)

A plugin is a [Module](#module) that adheres to the rules of the frontend plugin framework.

#### Imported Plugin

An imported plugin is loaded into a [Site](#site) at _buildtime_ via the [Site Config](#site-config).  It does not include a security sandbox around the plugin, though it includes an error boundary.

#### Federated Plugin

A federated plugin is loaded into the [Site](#site) at _runtime_ via module federation.  It does not include a security sandbox around the plugin, though it includes an error boundary.

#### IFrame Plugin

An iframe plugin is loaded into the [Site](#site) at _runtime_ via an iframe.  It is the only way to safely load third-party or untrusted code, but should be used sparingly because it impacts performance significantly.

### Plugin Slot

A designated place in the component hierarchy that will accept [Plugins](#plugin-module-plugins-widgets).  Plugin slots have documented layout expectations, configuration requirements, and contextual data that they share with [Plugins](#plugin-module-plugins-widgets).

### Service Module

A service module is an implementation of one of the services in frontend-base, such as logging or analytics.

### Script Module

A script module adds arbitrary functionality or third-party scripts to a [Site](#site) via script tags.  They are generally, but not always, non-visual in nature.

## Project

A project is a repository representing a [Site](#site) or a group of [Modules](#module) to be deployed together via module federation.  A project consists of a [Site Config](#site-config) file, various development files (tsconfig.json, .eslintrc.js, jest.config.js, etc.), optionally a [Build Config](#build-config) file, and the code and stylesheets that represent an operator's customizations to the [Site](#site).  This will primarily consist of custom [Modules](#module) to modify or extend the functionality of the [Site](#site).

## Shell

The shell is the top-level components in a [Site](#site) which visually and logically wrap [Modules](#module).  The shell also provides shared dependencies used by [Modules](#module).

## Build Config

A JavaScript file which represents the build configuration of a [Site](#site).  It is _buildtime_ code.  It is primarily used to tell webpack which [Modules](#module) to bundle for module federation from the [Project's](#project) dependencies.  It can also be used to pass other build-time variables (like a port) into webpack.

## Imported Apps

An Imported App is an [Application Module](#application-module-applications-apps) that has been included in the [Site Config](#site-config) by, quite literally, being imported into it.  These apps are linked into the [Site](#site) at buildtime.  It's generally desirable to lazy load them at runtime to keep initial bundle size small.

## Federated Apps

A Federated App uses module federation to be loaded into the [Site](#site) at runtime.  Federated apps are deployed independently from the [Site](#site).

### Host

A Host is the [Site](#site) loading a [Module](#module) via module federation.

### Guest

A Guest is the [Module](#module) being loaded into a [Site](#site) via module federation.

### Remote

A remote is module federation's term for an independently deployed bundle of [Modules](#module) loaded into a [Site](#site).  A remote may contain one or more potential [guests](#guest).  Module federation relies on the [Host](#host) knowing the location of the remote and its manifest, and uses that information to locate and load individual [Modules](#module) as [guests](#guest).

### Remote Discovery

Remote discovery is the process of locating [Remotes](#remote) on the Internet.  This can happen at buildtime via the [Site Config](#site-config), or it can happen at runtime.  An important feature of webpack module federation is that it supports _runtime_ remote discovery; other implementations do not.  A [Module](#module) that wants to load its own [Modules](#module) via module federation, for instance, will cause the [Shell](#shell) to engage in _runtime_ remote discovery after loading the first [Module](#module).

## Linked Apps

A linked app is an external website that a [Site](#site) can navigate to.  This may be another [Site](#site) as defined in this glossary, or it may just be some other webpage, such as a support portal.  Linked Apps are an important architectural option which allows us to do partial or gradual updates of our [Open edX frontend](#open-edx-frontend) by dividing it in pieces.  If a frontend needs to migrate through breaking changes in its dependencies, like React or React Router, for instance, we can use this mechanism to split the [Site](#site) in two and migrate [Apps](#application-module-applications-apps) from one [Site](#site) to the other as they update the dependency with the breaking change.  It will also allow some [Apps](#application-module-applications-apps) to stay as independently deployed, [legacy MFEs](#micro-frontend), for instance.  It consists of an identifier for an [App](#application-module-applications-apps), and a URL where it's located.
