import { AngularEditorConfig } from '@kolkov/angular-editor';

const ConfigEditorEnabled: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    outline: false,
    showToolbar: true,
    placeholder: '',
    sanitize: false,
    toolbarPosition: 'top',
    translate: 'yes',
    toolbarHiddenButtons: [
        [
            'strikeThrough',
            'subscript',
            'superscript',
            'heading',
            'fontName'
        ],
        [
            'backgroundColor',
            'customClasses',
            'link',
            'unlink',
            'insertImage',
            'insertVideo',
            'insertHorizontalRule',
            'removeFormat',
            'toggleEditorMode'
        ]
    ]
};

const ConfigEditorDisabled: AngularEditorConfig = { editable: false, showToolbar: false, outline: false }

export {
    ConfigEditorEnabled,
    ConfigEditorDisabled
}