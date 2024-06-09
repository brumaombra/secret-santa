import { reactive } from 'vue';

export default reactive({
    deleteId: null, // The ID of the participant to delete
    participantDialogModel: { // The model for the participant dialog
        name: '',
        email: '',
        currentEdit: null, // Flag to indicate that the user is editing a participant
        nameIsValid: false, // Flag to indicate if the name is valid
        emailIsValid: false, // Flag to indicate if the email is valid
        buttonSaveEnabled: false // Flag to indicate if the save button is enabled
    }
});