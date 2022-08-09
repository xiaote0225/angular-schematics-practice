import { apply, mergeWith, move, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';

import { strings } from '@angular-devkit/core'; //引入strings,所有字串处理函式都在里面

// import * as ts from 'typescript';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.

//需要先在终端中输入 'npm install @schematics/angular -S'
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';


import { validateName, validateHtmlSelector } from '@schematics/angular/utility/validation';
import { buildRelativePath, findModuleFromOptions, ModuleOptions } from '@schematics/angular/utility/find-module';
import { addDeclarationToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';


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

    // let importPath = '';
    // if(path === defaultProjectpath){
    //   importPath = './';
    // }else{
    //   importPath = path.replace(defaultProjectpath,'.') + '/';
    // }
    // importPath += 'hello-' + strings.dasherize(name) + '.component';

    // const appModulePath = `.${defaultProjectpath}/app.module.ts`;
    // const text = _tree.read(appModulePath) || [];

    validateName(name);
    validateHtmlSelector(`hello-${strings.dasherize(name)}`);
    const moduleOptions:ModuleOptions = {name:name,path:path};
    const modulePath = findModuleFromOptions(_tree,moduleOptions) || '';
    const sourceFile = ts.createSourceFile(
      'test.ts',
      (_tree.read(modulePath) || []).toString(),
      ts.ScriptTarget.Latest,
      true
    );

    // 将app.module.ts的程式码读取出来
    // const text = _tree.read('/projects/hello-world/src/app/app.module.ts') || [];
    // const sourceFile = ts.createSourceFile(
    //   'test.ts',
    //   text.toString(), //转成字串后丢进去以产生档案，方便后续操作
    //   ts.ScriptTarget.Latest,
    //   true
    // );
    // console.log('-------------------start');
    // console.log(sourceFile)
    // console.log('-------------------end');
    // 先从SourceFile往下找到ClassDeclarationClassDelcarationClassDeclaration
    // const classDeclaration = sourceFile.statements.find(node => ts.isClassDeclaration(node))! as ts.ClassDeclaration;
    //再往下找到Decorator
    // const decorator = classDeclaration.decorators![0] as ts.Decorator;
    //再往下找到CallExpression
    // const callExpression = decorator.expression as ts.CallExpression;
    //再往下找到ObjectLiteralExpression
    // const objectLiteralExpression = callExpression.arguments[0] as ts.ObjectLiteralExpression;
    //再往下找到Identifier 为 declarations 的 PropertyAssignment
    // const propertyAssignment = objectLiteralExpression.properties.find((property:ts.PropertyAssignment) => {
    //   return (property.name as ts.Identifier).text === 'declarations'
    // })! as ts.PropertyAssignment;;

    //再往下找到ArrayLiteralExpression
    // const arrayLiteralExpression = propertyAssignment.initializer as ts.ArrayLiteralExpression;

    //印出ArrayLiteralExpression的内容
    // console.log('-------------------start=======');
    // console.log(arrayLiteralExpression.getText());
    // console.log('-------------------end=======');
    // 先把原本在 `ArrayLiteralExpression` 的 Identifier 抓出來，後面需要用到
    // const identifier = arrayLiteralExpression.elements[0] as ts.Identifier;

    const componentPath = `${path}/hello-${strings.dasherize(name)}.component`;
    const classifiedName = `Hello${strings.classify(name)}Component`;
    const relativePath = buildRelativePath(modulePath, componentPath);
    const declarationChanges = addDeclarationToModule(sourceFile, modulePath, classifiedName, relativePath);
    
    // 跟 Tree 說要更新哪個檔案
    // const declarationRecorder = _tree.beginUpdate('/projects/hello/src/app/app.module.ts');
    // const declarationRecorder = _tree.beginUpdate(appModulePath);

    // 用 Identifier 從 SourceFile 找出較完整的字串內容
    // const changeText = identifier.getFullText(sourceFile);

    // const classifyName = strings.classify(name);
    // const componentName = `Hello${classifyName}Component`;
        
    // let toInsert = '';

    // 如果原本的字串內容有換行符號
    // if (changeText.match(/^\r?\r?\n/)) {

      // 就把換行符號與字串前的空白加到字串裡
      // toInsert = `,${changeText.match(/^\r?\n\s*/)![0]}${componentName}`;
    // } else {
      // toInsert = `, ${componentName}`;
    // }
    
    //  在原本的 Identifier 結尾的地方加上 ', HelloLeoChenComponent' 的字
    // declarationRecorder.insertLeft(identifier.end,toInsert);

    // 先抓到所有的 ImportDeclaration
    // const allImports = sourceFile.statements.filter( node => ts.isImportDeclaration(node) )! as ts.ImportDeclaration[];

    // 找到最後一個 ImportDeclaration 
    // let lastImport: ts.Node | undefined;
    // for (const importNode of allImports) {
    //   if ( !lastImport || importNode.getStart() > lastImport.getStart() ) {
    //     lastImport = importNode;
    //   }
    // }


    const declarationRecorder = _tree.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
  
    // 準備好要插入的程式碼
    // const importStr = `\nimport { HelloLeoChenComponent } from '${importPath}';`;
  
    // 在最後一個 ImportDeclaration 結束的位置插入程式碼
    // declarationRecorder.insertLeft(lastImport!.end, importStr);
    
    // 把變更記錄提交給 Tree ， Tree 會自動幫我們變更
    _tree.commitUpdate(declarationRecorder);
    
    // 重新讀取檔案並印出來看看
    // console.log(_tree.read('/projects/hello/src/app/app.module.ts')!.toString());






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
