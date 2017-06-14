# cycSlope
## Made with Express, Javascript, jQuery, Booststrap, and CSS

### Overview
cycSlope is a route planning web application for users who are looking to choose their routes based on elevation change. Using Google Maps APIs, it allows users to enter any starting point and destination point, and cycSlope will provide two to four different route options complete with a static map of the route and a visual line graph to display the elevation changes in each.

### Team Members
* Guido Bacce
* Merilee Wheelock
* Marissa Monivis
* Ian Booton

### Technologies Used
* Google Maps API
* jQuery
* AJAX
* Bootstrap
* MySQL
* Express
* EJS
* Node.js

### Dependencies
```
npm install express
npm install request
npm install mysql

npm install ejs
npm install express-session
npm install bcrypt-nodejs
```

### Challenges and Solutions
#### Learning SourceTree and GitHub
Our team collaborated through GitHub within the SourceTree UI. Most of the challenges we faced involved merge conflicts working on the same files among four team members. We were able to better understand the Resolve Conflicts options via "mine" or "their" files. We also grasped a better understanding of the commit/pull/push flow.
#### Processing Get/Post requests in a Single-Page Application
For our project, we decided to pursue the UX option of a single-page web application. Without applying React methodologies to our code, this proposed an issue with the standard "get" and "post" interactions of express. Since the user never actually leaves the index.ejs file after entering in start and end points, the site never reopened a "post" request to HTTP. To solve this, we added a "revisited" boolean to determine if the user is on the "get" or "post" index page.
#### JavaScript Promises
At this point in our course, we did not review JavaScript promises as a class, so we needed to explore documentation and promises syntax on our own. This allowed us to really dive into the methodolgies behind JavaScript promises and grasp a solid understanding of how it works in the code. We've included examples of the promise scripts in the code snippets below.

### Code Snippets
#### Log in functionality from index.js file
```
router.post('/processLogin', function(req,res){
    var email = req.body.email
    var password = req.body.password
    var selectQuery = "SELECT * FROM userInfo WHERE email = ?";
    connection.query(selectQuery, [email], function(error,results){
        if(results.length == 1){
            var match = bcrypt.compareSync(password, results[0].password)
            if (match == true){
                req.session.loggedin = true;
                req.session.username = results[0].username;
                req.session.email = results[0].email;
                req.session.id = results[0].id;
                currentID = results[0].id;
                res.redirect('/?msg=loggedin')
            }else{
                res.redirect('/?msg=badPass')
            }
        }else{
            res.redirect('/?msg=badEmailLogin')
        }
    });
});
```
#### JavaScript Promises from server.js
```
/*              .
                |
             .-"^"-.
            /_....._\
        .-"`         `"-.
       (  ooo  ooo  ooo  )
        '-.,_________,.-'
            /       \
          _/         \_
         `"`         `"`    */
         
getData: function(originInput, destinationInput) {
            var mapDetails = {};
            return new Promise((resolve, reject) => {
                getDirections(originInput, destinationInput).then(
                    function(directionsData){
                    	mapDetails.directionsData = directionsData;
                        getElevation(encodedPolyline).then(
		                    function(elevationData){
		                    	mapDetails.elevationData = elevationData;
		                        mapDetails.staticMap = drawStaticMap(encodedPolyline)
		                        resolve(mapDetails);
		                    }                        	
                        )
                    }
                )
        	});
		}
```
#### For Loop to display multiple routes and elevation maps
```
<% for (let i = 0; i < routeCount; i++) { %>

    <div class="item <% if (i == 0) {%>active<% } %>">
    <!-- mapApiUrl div -->
    <div class="text-center map-div" id="map<%=i + 1%>_div"><img class="map" src="<%= encodeURI(mapDetails.staticMap[i])%>" /></div>
    <!-- elevationData chart -->
    <div class="text-center elev-chart" id="chart<%=i + 1%>_div"></div>
    <!-- Distance / Change in Elevation / Time div -->
    <div class="carousel-caption caption">
        <h3>Route <%=i + 1%></h3>
        <ul>
            <li class="carousel-list">Distance: <span class="distance-result-<%=i + 1%>"><%=mapDetails.directionsData.routes[i].legs[0].distance.text%></span></li>
            <li class="carousel-list">Time: <span class="time-result-<%=i + 1%>"><%=mapDetails.directionsData.routes[i].legs[0].duration.text%></span></li>
        </ul>
    </div>
</div>
<% } %>
```

### Screenshots
#### Homepage
![Homepage](/public/images/homepage.png)
#### Route Search
![Route Search](/public/images/route-search.png)
#### Log In Modal
![Log In Modal](/public/images/login-modal.png)
#### Register Modal
![Register Modal](/public/images/register-modal.png)
#### User Profile Page
![User Profile Page](/public/images/profile-page.png)