const API_URL = 'https://graphql.datocms.com/';

function fetchAPI(token, query, { variables } = {}) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(res => {
    if(!res.ok) {
      throw new Error(`Failed to fetch content. ${res.status} ${res.statusText}`);
    }
    return res.json();
  }).then(json => {
    if (json.errors) {
      throw new Error(`Failed to fetch content. ${json.errors}`);
    }
    return json.data
  });
}

export function getCategories(token, publicationIds) {
  return fetchAPI(token,`
    query Categories($publicationIds: [ItemId]) {
      publications: allPublications(filter: {id: {in: $publicationIds}}) {
        id
        title
        categories
      }
    }`,
      {
        variables: {
          publicationIds,
        },
      }
  )
}
