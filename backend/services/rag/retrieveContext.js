async function retrieveContext(
  vectorStore,
  query
) {

  const docs =
    await vectorStore.similaritySearch(
      query,
      5
    );

  return docs;
}

module.exports =
retrieveContext;