# Fork from gatsby-source-personio-xml
Added internationalization support.

# gatsby-source-personio-xml

Source plugin for pulling data into Gatsby from a Personio XML feed.

## Install

```bash
npm install --save gatsby-source-personio-xml
```

or

```bash
yarn add gatsby-source-personio-xml
```

## How to use

In `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-personio-xml`,
      options: {
        url: `https://{username}.jobs.personio.de/xml`,
      },
    },
  ],
};
```

## How to query

You may access the following data node types:

| Node                 | Description                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `PersonioPosition`   | The job postings                                                                                                       |
| `PersonioDepartment` | The departments from `department` field in the [XML](https://developer.personio.de/docs/retrieving-open-job-positions) |
| `PersonioOffice`     | The offices from `office` field in the [XML](https://developer.personio.de/docs/retrieving-open-job-positions)         |

The field names follow the scheme in the [Personio XML feed](https://developer.personio.de/docs/retrieving-open-job-positions).

To retrieve a list of all departments with their job postings the following GraphQL query should work:

```graphql
allPersonioDepartment {
  edges {
    node {
      id
      name
      positions {
        id
        positionId
        recruitingCategory
        office {
          id
          name
        }
        employmentType
        schedule
        seniority
        subcompany
        yearsOfExperience
        name
        jobDescriptions {
          name
          value
        }
      }
    }
  }
}
```
