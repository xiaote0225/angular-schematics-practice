import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript'; 
import { buildDefaultPath } from '@schematics/angular/utility/project';

export function updateToV020(_options:any):Rule{
    return (_tree:Tree,_context:SchematicContext) => {


        const workspaceConfigBuffer = _tree.read('angular.json');
        if ( !workspaceConfigBuffer ) {
          throw new SchematicsException('Not an Angular CLI workspace');
        }
    
        const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
        const projectName = workspaceConfig.defaultProject;
        const project = workspaceConfig.projects[projectName];
        const defaultProjectPath = buildDefaultPath(project);

        // 把 app.component.ts 轉成 Typescript AST
        const componentPath = `${defaultProjectPath}/app.component.ts`;
        const componentSourceFile = readIntoSourceFile(_tree, componentPath);

        // 試著找出 title 屬性
        const classDeclaration = componentSourceFile.statements.find( node => ts.isClassDeclaration(node) )! as ts.ClassDeclaration;
        const allProperties = classDeclaration.members.filter( node => ts.isPropertyDeclaration(node) )! as ts.PropertyDeclaration[];    
        const titleProperty = allProperties.find( node => node.name.getText() === 'title' );
        
        // 如果有找到 title 屬性再修改程式碼
        if ( titleProperty ) {
            const initialLiteral = titleProperty.initializer as ts.StringLiteral;

            const componentRecorder = _tree.beginUpdate(componentPath);
            const startPos = initialLiteral.getStart();
            componentRecorder.remove(startPos, initialLiteral.getWidth());
            componentRecorder.insertRight(startPos, '\'Leo Chen\'');

            _tree.commitUpdate(componentRecorder);
        }


        return _tree;
    }
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}