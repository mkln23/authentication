import ExcelJS from 'exceljs';
import type { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import xlsx from 'node-xlsx';
import path from 'path';

import { MiscellaneousService } from '@/services/misc.service';

export const downloadFile: RequestHandler = (_req, res) => {
    const downloadPath = path.join(__dirname, '../../package.json');
    console.log(downloadPath);
    res.status(200).sendFile(downloadPath, () => {
        console.log('sent');
    });
};

export const downloadExcelFile = async (_: Request, res: Response) => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Define columns
    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
    ];

    // Add some rows
    worksheet.addRow({ id: 1, name: 'Alice', email: 'alice@example.com' });
    worksheet.addRow({ id: 2, name: 'Bob', email: 'bob@example.com' });

    // Set headers to indicate file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

    // Stream the workbook directly to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
};

export const downloadExcelWithNodeXlsx: RequestHandler = (_req, res) => {
    // Define sheet data
    const data = [
        ['ID', 'Name', 'Email'], // Header row
        [1, 'Alice', 'alice@example.com'],
        [2, 'Bob', 'bob@example.com'],
    ];

    // Build the Excel file (returns a Buffer)
    const buffer = xlsx.build([{ name: 'Users', data, options: {} }]);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

    // Send the buffer
    res.send(buffer);
};

export const extractText: RequestHandler = async (_req, res) => {
    const message = await MiscellaneousService.extractTextUsingOCR();
    res.status(httpStatus.OK).json(message);
};
