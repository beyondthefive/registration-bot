const discord_utils = require('./discord_utils');

async function get_records(notion, database_id, filter = undefined, sorts = undefined) { 
	// filter (object, see docs) specifies which records to get (most common use case is getting only the records w/ the "NEED BOT TO UPDATE" property checked)
	// sorts (array of sort objects, see docs) orders the pages in the returned object according to specified properties

	// conditionally add properties to the request based on specified params
  const response = await notion.databases.query({
    database_id: database_id,
    ...(!(filter == undefined) && {filter : filter}),
    ...(!(sorts == undefined) && {sorts : sorts})
  });
  return response;
};


module.exports = {
	students_id: "3fa8f9caeccd42a1ad5125193c9aa300",
	get_records: get_records
};