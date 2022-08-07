# Yap Header

Remember: 
- Make sure mongod and nodemon is active
- When looking at the actual db, make sure we're "use yap-restaurants" then "show collections" so we can use "db.restaurants.find()"
- To avoid unwanted formatting (const restaurant = <%-JSON.stringify( restaurant )%>; -> const restaurant = <% - JSON.stringify( restaurant )%>;) that breaks HTML and the like, press Ctrl+K then S so save without formatting
