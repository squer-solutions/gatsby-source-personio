import { select } from 'xpath';
import { DOMParser } from '@xmldom/xmldom';
import axios from 'axios';

exports.createSchemaCustomization = ({ actions: { createTypes } }, { locale }) => {
  const localeUpper = firstUpper(locale);
  createTypes(`
    type PersonioPosition${localeUpper} implements Node {
      id: ID!
      positionId: Int!
      subcompany: String
      office: PersonioOffice${localeUpper} @link(from: "office.name" by: "name")
      department: PersonioDepartment${localeUpper} @link(from: "department.name" by: "name")
      recruitingCategory: String
      name: String!
      employmentType: String
      seniority: String
      schedule: String
      yearsOfExperience: String
      jobDescriptions: [JobDescription${localeUpper}]
    }
    type JobDescription${localeUpper} {
      name: String
      value: String
    }
    type PersonioDepartment${localeUpper} implements Node {
      id: ID!
      name: String!
      positions: [PersonioPosition${localeUpper}] @link(by: "positionId")
    }
    type PersonioOffice${localeUpper} implements Node {
      id: ID!
      name: String!
      positions: [PersonioPosition${localeUpper}] @link(by: "positionId")
    }
  `);
};

exports.sourceNodes = async (props, options) => {
  const {
    actions: { createNode },
    createContentDigest,
    createNodeId,
  } = props;
  const {url, locale} = options;
  const localeUpper = firstUpper(locale);

  if (!url) {
    throw new Error('No Personio XML URL defined');
  }

  console.debug(`Fetching Personio XML…`);

  const localizedUrl = `${url}?language=${locale}`

  await axios
    .get(localizedUrl)
    .then((response) => {
      console.debug(`Received Personio XML`);

      const data = readJobsFromXml(response.data);

      data.forEach((item) => {
        createNode({
          id: createNodeId(`personio-department-${item.department}-${locale}`),
          name: item.department,
          positions: data
            .filter((i) => i.department === item.department)
            .map((i) => i.id),
          parent: null,
          children: [],
          internal: {
            type: `PersonioDepartment${localeUpper}`,
            contentDigest: createContentDigest(item.department),
          },
        });

        createNode({
          id: createNodeId(`personio-office-${item.office}-${locale}`),
          name: item.office,
          positions: data
            .filter((i) => i.office === item.office)
            .map((i) => i.id),
          parent: null,
          children: [],
          internal: {
            type: `PersonioOffice${localeUpper}`,
            contentDigest: createContentDigest(item.office),
          },
        });

        createNode({
          id: createNodeId(`personio-position-${item.id}-${locale}`),
          positionId: item.id,
          subcompany: item.subcompany,
          office: {
            name: item.office,
          },
          department: {
            name: item.department,
          },
          recruitingCategory: item.recruitingCategory,
          name: item.name,
          employmentType: item.employmentType,
          seniority: item.seniority,
          schedule: item.schedule,
          yearsOfExperience: item.yearsOfExperience,
          jobDescriptions: item.jobDescriptions,
          parent: null,
          children: [],
          internal: {
            type: `PersonioPosition${localeUpper}`,
            content: JSON.stringify(item),
            contentDigest: createContentDigest(item),
          },
        });
      });
    })
    .catch(() => console.error(`Fetching the Personio XML failed`));

  return;
};

const readJobsFromXml = (xml) => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');

  return select('//position', doc).map((node) => {
    return {
      id: select('number(id)', node),
      subcompany: optional(select('string(subcompany)', node)),
      office: select('string(office)', node),
      department: select('string(department)', node),
      recruitingCategory: select('string(recruitingCategory)', node),
      name: select('string(name)', node),
      employmentType: optional(select('string(employmentType)', node)),
      seniority: optional(select('string(seniority)', node)),
      schedule: optional(select('string(schedule)', node)),
      yearsOfExperience: optional(select('string(yearsOfExperience)', node)),
      jobDescriptions: select(`jobDescriptions/jobDescription`, node).map(
        (jobDescription) => {
          return {
            name: select('string(name)', jobDescription),
            value: select('string(value)', jobDescription),
          };
        },
      ),
    };
  });
};

const firstUpper = (value) => { return value.charAt(0).toUpperCase() + value.slice(1)};

const optional = (value) => {
  return !!value ? value : null;
};
