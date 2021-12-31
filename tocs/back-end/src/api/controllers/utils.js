import { Parser } from "json2csv";

const asyncWrapper = (callback) => (req, res, next) =>
  callback(req, res, next).catch(next);

const downloadCsv = (res, fileName, fields, data) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment(fileName);
  return res.send(csv);
};

export { asyncWrapper, downloadCsv };
