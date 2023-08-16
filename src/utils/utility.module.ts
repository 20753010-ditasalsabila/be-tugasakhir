import { Module } from '@nestjs/common';
import HashUtil from './common-util/hash.util';
import RenameFileUtil from './common-util/rename.file.util';
import SlugUtil from './common-util/slug.util';
import TokenUtil from './common-util/token.util';
import ValidatorUtil from './common-util/validator.util';

@Module({
  providers: [HashUtil, ValidatorUtil, RenameFileUtil, SlugUtil, TokenUtil],
  exports: [HashUtil, ValidatorUtil, RenameFileUtil, SlugUtil, TokenUtil],
})
export default class UtilityModule {}
