// Logistic curve
// y = maximum / (1 + e^(-steepness * (x - midpoint))) + offset
export default
    (midpoint, maximum, steepness, offset) => x =>
        maximum / (1 + Math.pow(Math.E, -steepness * (x - midpoint))) + offset


// -3 + 4/(1+e^(-x))
// Aternative:
// -1 + 2*0.5/(1+0.5^(2/1))^(1/2)
