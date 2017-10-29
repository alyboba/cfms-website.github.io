export default class MeetingRegistrationsController {
    constructor(authenticationService, meetingRegistrationRepository) {
        this.auth = authenticationService;
        this.exchangePaymentRepository = meetingRegistrationRepository;
        this.t = null;
        this.process();
    }

    process() {
        if (!this.auth.user || !this.auth.user.isAdmin) return console.log('Access denied.');
        let profile = this.auth.user;

        this.t = $('#example').DataTable();

        this.exchangePaymentRepository.getAll().then(val => {
            let meetingBox = $('#selected-meeting');
            let meetings = {};
            val.forEach(meeting => {
                meetings[meeting.key] = meeting;
                meetingBox.append($('<option>', {
                    value: meeting.key,
                    text: meeting.key
                }));
            });
            meetingBox.change(() => {
                const id = meetingBox.val();
                this.t.clear();
                this._populateTable(id, meetings[id].val())
            });
        });
    }

    _populateTable(id, meeting) {
        for(let meetingId in meeting) {
            this.exchangePaymentRepository.get(`${id}/${meetingId}`).then(val => {
                const user = val.user;
                const row = [
                    meetingId,
                    user.email,
                    user.given_name,
                    user.family_name,
                    val.amount,
                    val.approved
                ];
                this.t.row.add(row).draw(false);
            });
            
        }
    }
}