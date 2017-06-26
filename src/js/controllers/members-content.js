import { FirebaseConnection } from '../repositories/firebase/utils';

export default class extends FirebaseConnection {
    constructor(authenticationService) {
        super();
        this.auth = authenticationService;
        this.membersOnly = document.getElementsByClassName('members-only');
        if (this.membersOnly.length !== 0) this.process();
    }

    process() {
        let editor = document.getElementById('edit-members-only');
        if (editor && this.auth.user.isAdmin) return this.injectEditor(editor);
        console.log("Fetching members only content from firebase...");
        const refPath = 'members_only_content' + this.urlToRef(); // TODO: DRY this crap up
        const ref = this.firebase.database().ref(refPath);
        const valRef = ref.child('/value');
        valRef.once('value', snapshot => {
            if (snapshot.val()) this.membersOnly[0].innerHTML = snapshot.val();
        });
    }

    injectEditor(editor) {
        const refPath = 'members_only_content' + this.urlToRef();
        const codeMirror = new CodeMirror(editor, { lineWrapping: true, lineNumbers: true, mode: 'htmlmixed' });
        const ref = this.firebase.database().ref(refPath);
        const valRef = ref.child('/value');

        let firepad = Firepad.fromCodeMirror(ref, codeMirror);

        firepad.on('synced', function(isSynced) {
            if (isSynced) valRef.set(firepad.getText());
        });

        valRef.on('value', snapshot => document.getElementById('preview').innerHTML = snapshot.val());
    }

    urlToRef() {
        return window.location.pathname.split(".")[0];
    }

    checkDomain() {
        return ["app.cloudcannon.com", "localhost:4000"].includes(window.location.host);
    }
}