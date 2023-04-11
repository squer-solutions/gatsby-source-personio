# SQUER-Fork from gatsby-source-personio-xml
Added internationalization support.

A locale can now be provided which is used when querying the Personio-website.

The readme below has been updated accordingly.

## gatsby-source-personio-xml

Source plugin for pulling data into Gatsby from a Personio XML feed.

### Install

```bash
npm install --save gatsby-source-personio-xml
```

or

```bash
yarn add gatsby-source-personio-xml
```

### How to use

In `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-personio-xml`,
      options: {
        url: `https://{username}.jobs.personio.de/xml`,
        locale: `de`
      },
    },
  ],
};
```

### How to query

You may access the following data node types:

| Node                       | Description                                                                                                            |
|----------------------------| ---------------------------------------------------------------------------------------------------------------------- |
| `PersonioPosition{locale}` | The job postings                                                                                                       |
| `PersonioDepartment{locale}`       | The departments from `department` field in the [XML](https://developer.personio.de/docs/retrieving-open-job-positions) |
| `PersonioOffice{locale}`           | The offices from `office` field in the [XML](https://developer.personio.de/docs/retrieving-open-job-positions)         |

The field names follow the scheme in the [Personio XML feed](https://developer.personio.de/docs/retrieving-open-job-positions).

To retrieve a list of all departments with their job postings the following GraphQL query should work:

```graphql
allPersonioDepartmentEn {
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
