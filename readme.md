# cycSlope
## Made with Express, Javascript, jQuery, Booststrap, and CSS

### Overview
cycSlope is a route planning web application for users who are looking to choose their routes based on elevation change. Using Google Maps APIs, it allows users to enter any starting point and destination point, and cycSlope will provide three route options complete with a static map of the route and a visual line graph to display the elevation changes in each.

### Team Members
* Guido Bacce
* Merilee Wheelock
* Marissa Monivis
* Ian Booton

### Technologies Used
Google Maps API
jQuery
AJAX
Bootstrap
MySQL
Express
EJS
Node.js

### Dependencies
```
npm install express
npm install request
npm install mysql

npm install ejs
npm install express-session
npm install bcrypt
```

### Challenges and Solutions
#### Learning SourceTree and GitHub
Our team collaborated through GitHub within the SourceTree UI. Most of the challenges we faced involved merge conflicts working on the same files among four team members. We were able to better understand the Resolve Conflicts options via "mine" or "their" files. We also grasped a better understanding of the commit/pull/push flow.
#### Processing Get/Post requests in a Single-Page Application
For our project, we decided to pursue the UX option of a single-page web application. Without applying React methodologies to our code, this proposed an issue with the standard "get" and "post" interactions of express. Since the user never actually leaves the index.ejs file after entering in start and end points, the site never reopened a "post" request to HTTP. To solve this, we implemented several JavaScript promises to tell our code to check back on the code to see if a user enters a start point and end destination.
#### JavaScript Promises
At this point in our course, we did not review JavaScript promises as a class, so we needed to explore documentation and promises syntax on our own. This allowed us to really dive into the methodolgies behind JavaScript promises and grasp a solid understanding of how it works in the code. We've included examples of the promise scripts in the code snippets below.

### Code Snippets
```
server.js promises (getData)
for loop for the multiple routes/elevation maps
```

### Screenshots
