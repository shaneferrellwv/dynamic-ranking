# Models

## Weighted Sum Model (WSM)

$$
S_i = \sum_{j=1}^{n} w_j \cdot x_{ij}
$$

$$
S_i = \text{score of alternative } i
$$

$$
w_j = \text{weight of criterion } j
$$

$$
x_{ij} = \text{normalized value of criterion } j \text{ for alternative } i
$$

$$
n = \text{total number of criteria}
$$

## Weighted Product Model (WPM)

$$
P_i = \prod_{j=1}^{n} x_{ij}^{w_j}
$$

$$
P_i = \text{product score of alternative } i
$$

$$
x_{ij} = \text{normalized value of criterion } j \text{ for alternative } i
$$

$$
w_j = \text{weight of criterion } j
$$

$$
n = \text{total number of criteria}
$$

## Custom Defined Models

To define a custom scoring model, define a new key-value pair in the `models` object in `lib/models.js`, where the key is a unique string identifier and the value is a function that takes `(item, features)` as arguemnts and returns a numerical score. 