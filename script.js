import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
        import { getFirestore, doc, updateDoc, increment, writeBatch, setDoc, collection, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyC0JLvxC286PUDwjx2oeEkhOMTr_TsYPRg",
            authDomain: "evaluationsysboc.firebaseapp.com",
            projectId: "evaluationsysboc",
            storageBucket: "evaluationsysboc.appspot.com",
            messagingSenderId: "990176597",
            appId: "1:990176597:web:2c5dd4ed7df2f3babc01dc",
            measurementId: "G-MZ4TLL0THZ"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const form = document.getElementById('MainForm');
        const questions = Array.from({ length: 6 }, (_, i) => document.getElementById(`Q${i + 1}`));
        const suggestion = document.getElementById('suggestion');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (localStorage.getItem('feedbackSubmitted') === 'true') {
                showAlert("You have already submitted your feedback.");
                return;
            }

            const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
            loadingModal.show();

            const branchCode = JSON.parse(sessionStorage.getItem("branch-num"));
            const batch = writeBatch(db);

            console.log("Submitting feedback...");

            questions.forEach((question, index) => {
                if (question) {
                    const response = question.value;
                    console.log(`Question ${index + 1}: ${response}`);

                    const docRef = doc(db, `Br_in_Area/${branchCode}/Q${index + 1}/responses`);
                    batch.set(docRef, { [response]: increment(1) }, { merge: true });
                } else {
                    console.warn(`Question ${index + 1} element not found or value is undefined.`);
                }
            });

            // Save the suggestion with a unique identifier
            const suggestionText = suggestion.value;
            if (suggestionText.trim()) {
                const suggestionCollectionRef = collection(db, `Br_in_Area/${branchCode}/suggestions`);
                const suggestionCountRef = doc(suggestionCollectionRef, 'count');
                const suggestionCountSnap = await getDoc(suggestionCountRef);

                let suggestionCount = 1;
                if (suggestionCountSnap.exists()) {
                    suggestionCount = suggestionCountSnap.data().count + 1;
                }

                const suggestionId = `suggestion${String(suggestionCount).padStart(2, '0')}`;
                await setDoc(doc(suggestionCollectionRef, suggestionId), { suggestion: suggestionText });
                await setDoc(suggestionCountRef, { count: suggestionCount }, { merge: true });
            }

            // Increment the total response count
            const totalRespCountRef = doc(db, `Br_in_Area/${branchCode}/respCount/totalRespCount`);
            batch.set(totalRespCountRef, { count: increment(1) }, { merge: true });

            try {
                await batch.commit();
                console.log("Feedback Submitted successfully!");
                showAlert("Feedback Submitted successfully!");
                localStorage.setItem('feedbackSubmitted', 'true');
            } catch (error) {
                console.error("Error submitting feedback:", error);
                showAlert("Failed to submit feedback. Please try again later.");
            } finally {
                loadingModal.hide();
            }
        });

        function showAlert(message) {
            const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
            document.getElementById('alertModalBody').innerText = message;
            alertModal.show();
        }
