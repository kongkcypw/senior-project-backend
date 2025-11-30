import { Injectable } from "@nestjs/common";
import { LineLiffConfigService } from "./config.service";
import { LINE_LIFF_BASE_URL } from "../constants/base-url.constant";
import { WebPath } from "../enums/web-path.enum";

@Injectable()
export class LineLiffNavigatePathService {

    private basePath: string = LINE_LIFF_BASE_URL;
    private liffId: string;

    constructor(
        private readonly lineLiffConfigService: LineLiffConfigService,
    ) {
        this.liffId = this.lineLiffConfigService.liffId;
    }

    get navigateProfilePage(): string {
        return `${this.basePath}/${this.liffId}/${WebPath.PROFILE}`;
    }

    get bodyInformationPage(): string {
        return `${this.basePath}/${this.liffId}/${WebPath.BODY_INFORMATION}`;
    }
}