import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage, Response } from 'util/response.util';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService) { }

    @Get()
    getUpload(): Response {
        return new ResponseMessage()
            .success()
            .body('Upload')
            .build();
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: any): Promise<any> {
        return await this.uploadService.uploadLabFile(file);
    }
}
