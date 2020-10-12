Gatsby source plugin for [Pokko](https://www.pokko.io/)

# gatsby-source-pokko

Source plugin for pulling models and entries into Gatsby from Pokko. It creates links between records so they can be queried in Gatsby using GraphQL.

## Installation

```
npm install --save gatsby-source-pokko
# or
yarn add gatsby-source-pokko
```

## How to use

```
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-pokko`,
    options: {
      token: `YOUR_API_TOKEN`,
      project: `YOUR_PROJECT_KEY`,
      environment: `YOUR_ENVIRONMENT_KEY`,
    },
  },
]
```
