const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {

    constructor() {
        this.doc = new GoogleSpreadsheet('1HrhmqxPqS8Qs0QWge-TN40jOp_cUHJX0ROk5KIqwsxQ');
    }

    async load() {
        await this.doc.useServiceAccountAuth(require('./credentials.json'));
        await this.doc.loadInfo();
    }

    async addRows(rows, i) {
        const sheet = this.doc.sheetsByIndex[i];
        await sheet.addRows(rows);
    }

    async getRows(i) {
        const sheet = this.doc.sheetsByIndex[i];
        const rows = await sheet.getRows();
        return rows;
    }

}