// Define the model name you want to query
const targetModelName = "User"; // Change this to filter by different models

// Query histories filtered only by model name
const results = db.histories.find({ 
  "modelName": targetModelName
}).sort({ "historyAt": -1 }).toArray(); // -1 means newest first

// Format date fields for better readability
const formattedResults = results.map(record => {
  // Convert ObjectId to string
  const id = record._id.toString();
  const origId = record.originalId.toString();
  
  // Format date if it exists
  const historyDate = record.historyAt ? 
    new Date(record.historyAt).toISOString().replace('T', ' ').substring(0, 19) : 'N/A';
  
  // Format values for display
  const oldValuesStr = JSON.stringify(record.oldValues || {});
  const newValuesStr = JSON.stringify(record.newValues || {});
  
  return {
    ID: id.substring(id.length - 6),
    OriginalId: origId.substring(origId.length - 6),
    Operation: record.operation,
    OldValues: oldValuesStr.length > 30 ? oldValuesStr.substring(0, 30) + '...' : oldValuesStr,
    NewValues: newValuesStr.length > 30 ? newValuesStr.substring(0, 30) + '...' : newValuesStr,
    HistoryDate: historyDate,
    ChangedBy: record.changedBy || 'N/A'
  };
});

// Calculate max column widths based on content
const headers = Object.keys(formattedResults[0] || {});
const columnWidths = {};

// Initialize with header lengths
headers.forEach(header => {
  columnWidths[header] = header.length;
});

// Update with content lengths
formattedResults.forEach(row => {
  headers.forEach(header => {
    const contentLength = String(row[header]).length;
    if (contentLength > columnWidths[header]) {
      columnWidths[header] = contentLength;
    }
  });
});

// Create a table-like output
let tableOutput = `\n== ${targetModelName.toUpperCase()} HISTORY RECORDS ==\n`;

// Create separator based on calculated widths
const separator = "+" + headers.map(h => "-".repeat(columnWidths[h] + 2)).join("+") + "+";

// Add headers
tableOutput += separator + "\n";
tableOutput += "| " + headers.map(h => h.padEnd(columnWidths[h])).join(" | ") + " |\n";
tableOutput += separator + "\n";

// Add rows with proper padding
formattedResults.forEach(row => {
  tableOutput += "| " + headers.map(h => String(row[h]).padEnd(columnWidths[h])).join(" | ") + " |\n";
});
tableOutput += separator;

// Print the table
print(tableOutput);
print(`Found ${results.length} history records for model: ${targetModelName}`);

// Just reference results - MongoDB will show its value
results;