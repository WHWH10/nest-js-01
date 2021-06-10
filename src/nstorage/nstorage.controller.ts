import { Controller, Get, Param } from '@nestjs/common';
import { ResponseMessage, Response } from 'util/response.util';
import { NstorageService } from './nstorage.service';

@Controller('nstorage')
export class NstorageController {
    constructor(private readonly nstorageService: NstorageService) { }

    @Get()
    getNstoage(): Response {
        return new ResponseMessage()
            .success()
            .body('NAVER CLOUD OBJECT STORAGE DATA')
            .build();
    }

    // Naver-cloud-obejct-storage 에 있는 전체 폴더 목록 불러오기
    @Get('/FolderList')
    async getFolderList(): Promise<any> {
        return await this.nstorageService.getFolderList();
    }

    // Naver-cloud-object-storage Lab별로 있는 파일 조회
    @Get('/FolderList/:labNum')
    async getLabFolderList(@Param('labNum') labNum: string): Promise<any> {
        return await this.nstorageService.getLabFolderList(labNum);
    }

    // Naver-cloud-object Lab별 원하는 파일 내용 조회
    @Get('/FolderList/:labNum/:fileName(*)')
    async getLabFileContent(@Param('labNum') labNum: string, @Param('fileName') fileName: string): Promise<any> {
        return await this.nstorageService.getLabFileContent(labNum, fileName);
    }
}
