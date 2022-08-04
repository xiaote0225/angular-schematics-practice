import { apply, mergeWith, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';

import { strings } from '@angular-devkit/core'; //引入strings,所有字串处理函式都在里面
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function helloWorld(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const sourceTemplates = url('./files');

    const sourceParametrizedTemplates = apply(sourceTemplates,[
      template({
        ..._options, //使用者所输入的参数
        ...strings, //将这些函式加到规则里，范本语法才能正常运作
        addExclamation
      })
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}

function addExclamation(value:string):string{
  return value + '!';
}
