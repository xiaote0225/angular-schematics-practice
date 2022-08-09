import { apply, mergeWith, move, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';

import { strings } from '@angular-devkit/core'; //引入strings,所有字串处理函式都在里面



// You don't have to export the function as default. You can also have more than one rule factory
// per file.

//需要先在终端中输入 'npm install @schematics/angular -S'
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/workspace';

export function helloWorld(_options: HelloSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    
    //读取angular.json,如果没有这个档案白哦是改专案不是Angular专案
    const workspaceConfigBuffer = _tree.read('angular.json');
    if(!workspaceConfigBuffer){
      throw new SchematicsException('Not an Angular CLI workspace');
    }

    //解析出专案的正确路径与档案名
    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];
    const defaultProjectpath= buildDefaultPath(project);
    const parsePath = parseName(defaultProjectpath,_options.name);
    const { name, path } = parsePath;

    const sourceTemplates = url('./files');
    const sourceParametrizedTemplates = apply(sourceTemplates,[
      template({
        ..._options, //使用者所输入的参数
        ...strings, //将这些函式加到规则里，范本语法才能正常运作
        name,  // 原本的 _options.name,避免使用错误的档案名
        addExclamation
      }),
      move(path) //将产生出来的档案移动到正确的目录下
    ]);
    return mergeWith(sourceParametrizedTemplates);
  };
}

function addExclamation(value:string):string{
  return value + '!';
}
