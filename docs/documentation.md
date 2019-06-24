# WIP: Documentation of the project "Berlin Heatmap" for TH Brandenburg

## 0. Student 
- Name: Antonio Rahn
- Course: Webprogrammierung by [Thomas Preuss](https://github.com/thomas-preuss)
- Semester: SS19
- Course of studies: OSMI

## 1. Overview
This project is a responsive web app with an interactive map of the districts of Berlin.
It allows to enter a search term ("query"), and the map displays in which districts it is more or less "relevant".

The following documentation is structured as follows:

2. User perspective
3. Logic, "relevance", actual usability
4. Technical documentation  
  4.1 Research and planning  
  4.2 Frameworks and dependencies  
  4.3 Project structure  
  4.4 Search module  
  4.5 Map module  
    
## 2. User perspective

**Interface**

The user finds an intuitive interface, well known from other map-based apps and websites. 
There is a header with the "Berlin Heatmap" logo, that reloads the page when clicked. 
In the header there is also the already focussed search bar (promting the user to try out a search term) with a search button next to it.
There is also a "About this project" link for interested visitors.
Below the header filling the rest of the avaliable space is a map of berlin, where the districts are highlighted. 
The user can hover over (or on mobile: touch on) one district, which triggers the an info box to show information about the district.
The interface is responsible, which means it is designed to work on mobile phones, tablets and laptops/PCs.

**Search process**

If no search term is entered when clicking the search button, the search bar turns red, indicating the required field.
If a search term is entered, and the search is started either with the search button or with the `enter` key, the search button shows a loading indication.
If the search is done after a previous search, the district colors turn grey again. Once the loading is done, the loading indication stops, 
and the districts appear in colors from light yellow to dark red, indicating the "relevance" (see section 3.). This view is well known from maps displaying data, 
such as election data or the weather forecast. When the user hovers over or touches a district, the info box shows the number of search results for that district.

As in other map application, the map functionality can be used again and again without re-loading the page, by entering a different search term.  

## 3. Logic, "relevance", actual usability
**Logic**

As in every city, in Berlin there are clichés about the people living in the different areas in the city. For example, about people in Kreuzberg it is told, 
that they like Matcha Latte Macchiato more than others. On the other hand, the relevance of a topic is sometimes underlined by stating "it has xyz search results on Google!". 
This map combines these two aspects, and tries to display how "relevant" a given term in for all the Berlin districts.

**"Relevance"**

My first idea was to get the number of last month searches on Google *from* a given area, for a given search term. For technical reasons (see 4.1.), 
it is now the number of search results on Bing for [search term + district name], for each district. This is still a plausible indicator of relevance, 
since it is a common scenario to search for something like "Latte Macchiato in Kreuzberg". 

**Actual usability**

For this university project, I am using the free version of the Bing API to get the numbers of search results. The requests per second are limited to 3, 
which leads to a quite long loading time (1 request per district necessary ), and was the reason for me to use districts ("Friedrichshain-Kreuzberg") instead of smaller localities ("Kreuzberg").
The number of Google search results is a way more frequently used number than the number of Bing search results, but Google doesn't provide an API to get these numbers (see 4.1.).
The Bing API returns a number called "totalEstimatedMatches", which sometimes differs from the number displayed on the Bing homepage. 
Also, the numbers appear to be changing from time to time, so while the results are not arbitrary, they are not necessarily the same tomorrow.

## 4. Technical documentation
My goal was to write a frontend only web application, that works as described above. Backend technology is not necessary, since nothing is safed in a database or the like, 
and no login procedure is required. I even managed to host the application directly on GitHub from the repository, without cluttering my version control (VC) with 
dependencies (they are loaded from a content delivery network (CDN)). The following sub-section describe the technology side of this project in more detail.

### 4.1. Research and planning

**Search application programming interface (API)**

As mentioned before, I originally intended to use Google search results, since the search engine is by far the most popular one. 
However, for the original web search, Google doesn't provide an API anymore, and scraping the results-page (imitating a ordinary search request) is prevented
with many technical tricks. Google offers a so called ["Custom Search API"](https://developers.google.com/custom-search/v1/overview), which is intended to be used on one's own website. Although it is possible to
enable a "search everywhere" functionality, it is unclear if the API then responses reliably. And the returned search results differed by far from the original
web search, not showing much relevant results at all. This is why I changed to the [Bing API](https://azure.microsoft.com/de-de/services/cognitive-services/bing-web-search-api/), which has a free plan with the limit of 3 transactions per second (TPS),
and 3000 transactions per month. This plan is bound to an API key, which (since I cannot hide it in a backend) can be retrieved if someone checks the request of the page
(in the Developer Console for example). In the code it is somewhat encrypted using [stringencrypt](https://www.stringencrypt.com/), to prevent a very lazy developer from stealing it, but of course this is not secure. 
Since this plan is a free plan, and this is a university project, I think this is okay. In a production environment, I would store the API key in the backend,
and would also make my requests from there.

**Modular JavaScript (JS)**

My goal was to organize my code in [JavaScript modules](https://www.freecodecamp.org/news/javascript-modules-a-beginner-s-guide-783f7d7a5fcc/), like in modern Node.js environments for example. This makes code very organized, maintainable and readable.
Since out-of-the-box JS has no access to the file system, different files (one for each module) would have to be included in the HTML as script, 
which would result in a lot of requests loading the page (can be slow), and the namespace would be polluted quite fast, since everything must be avaliable everywhere in order to work.
This is why I was looking for a framework that can handle modular JS *inside the browser*, and I found [require.js](https://requirejs.org/) and [webpack](https://webpack.js.org/). I decided to use require.js, since
no preprocessing is necessary, and thus I can host directly from the GitHub repository (with webpack, un-readable processed code would have to be included in the VCS).

Overall, research took about one month, and coding took about one month, while both overlapped resulting in a total duration of me working on the project of
about 7 weeks. 

### 4.2. Frameworks and dependencies
- **[require.js](https://requirejs.org/)** to organize the own code (modular JS) and dependencies. 
- **[jQuery](https://jquery.com/)**, a popular JS framework, that provides many helpful functions e.g. to manipulate the
document object model (DOM) and to make the Ajax requests to the Bing API.
- **[Bootstrap](https://getbootstrap.com/)**, a popular CSS/JS library, that helps with modern frontend elements such as styled search bars, 
normalized CSS margins and padding, and overall handy styling assistance.
- **[Fontawesome](https://fontawesome.com/)**, a popular library for icons.
- **[leaflet.js](https://leafletjs.com/)**, a popular JS library to work with maps, and in particular with OpenStreetMap.  
  - The berlin districts are stored as [geoJSON](https://geojson.org/), a popular standard to store complex polygons to be displayed on maps, 
  and are avaliable from [Technologiestiftung Berlin](https://data.technologiestiftung-berlin.de/dataset/bezirksgrenzen).  
  - The map tiles are from [CARTO](https://carto.com/), that provides some sets of tiles free of charge.

### 4.3. Project structure
The project is a single-page-application, since it has only one HTML file, called index.html.
This file contains the basic structure of the page (header, map area), and all relevant CSS files are linked.
Also, the require.js entry point is loaded (`js/app.js`). All other JS files/modules/dependencies are configured and loaded from there.

The `js` folder contains two sub-folders, one for own project code (`app`) and one for imported code (`lib`), like require.js itself, 
and the geoJSON file of the districts, which I saved as JS module there.

The `app` folder contains my own code for the project, organized in modules that I found to be useful, while
one JS file is one module. The modules are:

- `main.js` contains the core functionality, and is the heart of the project's logic. It aims to be very readable, 
only selecting the relevant HTML elements, initializing the map, and containing the function for new requests (that calls functions from other modules). 
The file is only 43 lines long, which is intended to be as readable as possible.
- `districts.js`, where I configure objects and arrays relevant for the different districts used. It doesn't contain functions.
- `search.js` contains all functions relevant for the search requests. More in section 4.5.
- `map.js` contains all functions relevant for the map to display and handle correctly. More in section 4.5.
- `helpers.js`, where I store supporting functions for the other modules. These functions would "pollute" the other modules, 
and would make them less readable. Also, the functions are used in several modules. 

At the beginning of a module, the models/dependencies to import are defined. 
At the end of a module, the functions and variables to be exported are defined.
Only those are avaliable in other modules, when the respective module is imported, all other functions/variables are private and only avaliable within the module. 
With this modular import/export logic, not every function/variable has to be avaliable everywhere, the global scope is less polluted.

### 4.4. Search module
All functions relevant for the Bing search API request are located in this module

`searchWithAllDistricts` is called in the main module when a new search is triggered. 
Since the free Bing API plan allows only 3 TPS, the function waits for 1.5 seconds after 3 requests.
It returns a [jQuery Deferred Object](http://michaelsoriano.com/working-with-jquerys-ajax-promises-and-deferred-objects/), which is basically a promise. The reason for this is, that the 
API responses take time to come back from the Bing API, but the functions returns something almost directly. 
This is where it gets asynchrone, that means the "program" doesn't pause and wait for the responses, but continues, 
and "comes back" to the results once they are there. Within the function, a multiple of requests are send (with
the also async `simpleQuery` function). When a result arrives, it gets handled by the `handleAPIResponse` function, 
and the `responsesObject` is filled district by district, while it is unclear at what time which district result returns (async).
To keep track of all responses, there is a `responseCounter`, and once it equals the number of districts, the returned promise gets
resolved, so that other functions that rely on the results can be triggered.

`DEVsearchWithAllDistricts` is a function for development, so that the 3000 Bing API requests per month 
are not used while testing. "From the outside" it can be used exactly like the functional `searchWithAllDistricts`, 
but it doesn't trigger real search requests, and returns random numbers instead of real result numbers. 

`simpleQuery` is called by `searchWithAllDistricts`, and contains the [Asynchronous JavaScript and XML (Ajax)](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started) request functionality for 
the Bing API requests. Like this, the project page can get new information without a page reload being necessary.
It gets the API key from `encryptKey`, merges a given search `query` and `district`as string, and performs a jQuery Ajax call.
The function returns a promise, so that `handleAPIResponse` can be triggered once the result arrived (async).

`handleAPIResponse` is called within `searchWithAllDistricts`, once a promise returned by `simpleQuery` is resolved. 
It navigates the returned JSON object and returns the value of the field `totalEstimatedMatches`, that the Bing API provides. 

### 4.5. Map module
All functions relevant for displaying and handling the map are located in this module. 
Leaflet.js is imported as module here, and used in all map operations.

`initialize` is called by main, once the page loaded. It sets the initial location, zoom and bounds of
the map. This is responsive, since the maximum zoom possible (while still seeing the whole of berlin) is applied, 
based on the avaliable space on the target device. Also, the user is restricted not to navigate away from
Berlin by dragging the map. The districts are loaded using Leaflet.js's geoJSON method, and colored gray initially. 
The info box is added to the map, and the relevant eventListeners are attached to the districts, to that
the info box shows information about a district when a user selects it (hovering mouse on Desktop, touch on mobile). 

`colorDistricts` is called in main, once all results arrived (and the respective promise is resolved). 
It takes the object of the results (containing entries like: {"Kreuzberg": 1900}) and calls `calculateRelativeRelevance`,
which normalizes the result, i.e. it looks for the most/least results district and gives it the value 1 or 0 
respectively. All in-between values then converted to floats between 0 and 1 (e.g. 0.75). To get the color of
a district, `getRelevanceColor` is called, which takes the relative relevance and returns 1 out of 8 colors as string, 
from light yellow for values close to 0 over orange for in-between values to dark red for 1. 

`resetDistrictColors` is called in main when a search request is triggered, to make all districts gray again.  
