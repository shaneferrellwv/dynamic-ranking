# API Reference

## Dataset

The library supports data in JSON and CSV formats. Data from any external API can be fetched on the client side via the library's public `fetchData()` function. Data must have named labels and the data's contents must be numeric to create rankings.

# Feature Configuration

Decision-making criteria must be specified prior to creation of the DyanmicRanking object. Features are provided in an array of objects, each with the following fields:

##### id

