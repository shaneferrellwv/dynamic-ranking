# API Reference

## Dataset

The library supports data in JSON and CSV formats. Data from any external API can be fetched on the client side via the library's public `fetchData()` function. Data must have named labels and the data's contents (except for the primary key) must be numeric to create rankings.

    const data = [
        { Model: 'Toyota Corolla', Horsepower: 139, Weight: 1295, Fuel Efficiency: 6.8, Price: 21000 }
        { Model: 'Honda Civic', Horsepower: 158, Weight: 1270, Fuel Efficiency: 6.4, Price: 23000 }
        { Model: 'Mazda 3', Horsepower: 186, Weight: 1340, Fuel Efficiency: 6.6, Price: 24000 }
    ];


# Feature Configuration

Decision-making criteria must be specified prior to creation of the DyanmicRanking object. Features are provided in an array of objects, each with the following fields:

    const features = [
        { id: 'Horsepower', name: 'Horsepower', path: 'Horsepower', normalization: 'linear', strategy: 'maximize' }
        { id: 'Weight', name: 'Weight', path: 'Weight', normalization: 'linear', strategy: 'minimize' }
        { id: 'FuelEfficiency', name: 'Fuel Efficiency', path: 'Fuel Efficiency', normalization: 'standard', strategy: 'maximize' }
        { id: 'Price', name: 'Price', path: 'Price', normalization: 'standard', strategy: 'minimize' }
    ];

## Required Properties

### `id`
contains the unique identifier for the feature

\* id property can only contain **alphanumeric characters**

### `name`
contains the display name for the identifier

### `path`
specifies the path to nested data using colons as delimiter

### `normalization`
specifies the normalization technique for this feature

`normalization := [ 'linear' | 'log' | 'standard' ]`

### `strategy`
specifies if the feature should recieve higher scores for high values or low values

`strategy := [ 'maximize' | 'minimize' ]`

## Optional Properties

### `defaultWeight`
specifies this feature's default weight for the intial rankings

if this property is absent, default weight of 0 is used

### `minWeight`
specifies the lower bound for this feature's weight

if this property is absent, default minimum weight of 0 is used

### `maxWeight`
specifes the upper bound for this feature's weight

if this property is absent, default maximum weight of 10 is used

# Creating Your Ranking System

A ranking system is created by calling the public constructor for the DynamicRanking class as follows:

    import { DynamicRanking } from "../lib/dynamic-ranking.js";

    new DynamicRanking(
        slidersContainerId,
        rankingsContainerId,
        data,
        model,
        features,
        primaryKey,
        digits,
        sort
    );

## DynamicRanking Constructor Parameters

### `slidersContainerId`
id of the HTML div element to target to render sliders and user controls

### `rankingsContainerId`
id of the HTML div element to target to render rankings and scores

### `data`
data to be used for rankings

\* each item in the data must contain the primary key

### `model`
unique identifier of model to be used for rankings

`model := [ 'weighted-sum' | 'weighted-product' | ... ]`

see the [Models](models.md) page for more information on the provided models and custom models

### `features`
array of feature objects as specified in the [Feature Configuration](#feature-configuration) section

### `primaryKey`
specifies the field to uniquely identify and display each item in the dataset

the primaryKey is an object with two properties:

+ `id`: a unique identifier used internally that contains only alphanumeric characters
+ `path`: a string representing the location of the value within each item (using colons for nested keys)

### `digits`
number of digits to be rounded to when calculating score

### `sort`
specifies how rankings should be sorted

`sort := [ 'descending' | 'ascending' ]`