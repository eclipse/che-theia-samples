/**
 * Sample which demonstarates signature help plugin API.
 *
 * Provides signature help data for `solveQuadraticEquation` function,
 * which is overloaded and solves
 *   a*x^2 + b*x + c = 0            or  x^2 + b*x + c = 0
 *   solveQuadraticEquation(a,b,c)  or  solveQuadraticEquation(b,c)
 */

import * as theia from '@theia/plugin';

export function start(context: theia.PluginContext) {
    const documentsSelector: theia.DocumentSelector = { scheme: 'file', language: 'typescript' };
    const handler = { provideSignatureHelp: signatureHelpHandler };
    const triggerChars = '(,';

    context.subscriptions.push(
        theia.languages.registerSignatureHelpProvider(documentsSelector, handler, ...triggerChars)
    );
}

function signatureHelpHandler(document: theia.TextDocument, position: theia.Position): theia.ProviderResult<theia.SignatureHelp> {
    console.log('Signature help is triggered');

    const currentLine = document.lineAt(position.line).text;

    // Filter not supported items
    if (!isFunctionSupported(currentLine, position.character)) {
        return undefined;
    }

    // Hide signature help if cursor out of signature range
    if (currentLine.charAt(position.character - 1) === ')' || currentLine.charAt(position.character) === '(') {
        return undefined;
    }

    const argumentNumber = getArgumentNumber(currentLine, position.character);
    const signatures = (argumentNumber <= 2) ? [fullQuadraticEquationSignature, normalizedQuadraticEquationSignature] : [fullQuadraticEquationSignature];

    return {
        activeSignature: 0,                  // zero based
        activeParameter: argumentNumber - 1, // zero based
        signatures: signatures
    };
}

function getArgumentNumber(currentLine: string, char: number): number {
    const lineBeforeCursor = currentLine.substr(0, char);
    return lineBeforeCursor.split(',').length;
}

const FUNCTION_NAME = 'solveQuadraticEquation';
function isFunctionSupported(currentLine: string, char: number): boolean {
    return currentLine.indexOf(FUNCTION_NAME + '(') !== -1;
}

const fullQuadraticEquationSignature: theia.SignatureInformation = {
    label: 'solveQuadraticEquation(a: number, b: number, c: number): number[] | undefined',
    documentation: new theia.MarkdownString(
        'Solves quadratic equation: `a*x^2 + b*x + c = 0`. ' +
        'Returns array of roots or `undefined` if no solution in real numbers'),
    parameters: [
        {
            label: 'a: number',
            documentation: new theia.MarkdownString('Coefficient near `x^2`')
        },
        {
            label: 'b: number',
            documentation: new theia.MarkdownString('Coefficient near `x`')
        },
        {
            label: 'c: number',
            documentation: 'Free member of the quadratic equation'
        }
    ]
};

const normalizedQuadraticEquationSignature: theia.SignatureInformation = {
    label: 'solveQuadraticEquation(b: number, c: number): number[] | undefined',
    documentation: new theia.MarkdownString(
        'Solves normalized quadratic equation: `x^2 + b*x + c = 0`. ' +
        'Returns array of roots or `undefined` if no solution in real numbers'),
    parameters: [
        {
            label: 'b: number',
            documentation: new theia.MarkdownString('Coefficient near `x`')
        },
        {
            label: 'c: number',
            documentation: 'Free member of the quadratic equation'
        }
    ]
}

export function stop() {

}
