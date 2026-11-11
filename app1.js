function buildLoanRows(data) {

    const {readers, loans, books} = data

    // test case for checking the empty loan data
    if (data.loans.length === 0) {
        return []
    }


    // making the new object with map callBackFn
    function mappedLoanData(loan) {
        const {id, bookId, readerId, elapsedDays, returned} = loan

        // find book details
        function getBookDetails(book) {
            return bookId === book.id
        }

        // find reader details
        function getReadersDetails(reader) {
            return readerId === reader.id
        }


        let loanDays = books.find(getBookDetails).policy.loanDays
        let status = ""
        let remainingDays = 0
        let overdueDays = 0


        if (elapsedDays <= loanDays && !returned) {
            status = "on-time"
            remainingDays = loanDays - elapsedDays
        } else if (elapsedDays > loanDays && !returned) {
            status = "overdue"
            overdueDays = elapsedDays - loanDays
        } else if (returned) {
            status = "returned"
        }

        return {
            loanId: id,
            bookTitle: books.find(getBookDetails).title,
            readerLabel: readers.find(getReadersDetails)
                ? readers.find(getReadersDetails).profile.displayName
                : "عضو نامشخص",
            emailLabel: readers.find(getReadersDetails)?.contact?.email ? readers.find(getReadersDetails).contact.email : "عضو نامشخص",
            status: status,
            remainingDays: remainingDays,
            overdueDays: overdueDays
        }

    }

    return data.loans.map(mappedLoanData)
}


//find readerLabel function
function getReadersDisplay(data) {
    return data.loans.readerId === data.readers.id
}

// status ->
//  1. "on-time" -> elapsedDays <= loanDays
//  2. "returned" -> elapsedDays === loanDays
//  3. "overdue" -> elapsedDays > loanDays
// remainingDays
//  1. status === "returned" -> remainingDays = 0
//  2. status === "on-time" -> loanDays - elapsedDays
//  3. status === "overdue" -> remainingDays = 0
// overdueDays
//  1. status === returned -> overdueDays = 0
//  2. status === "on-time" -> overdueDays = 0
//  3. status === "overdue" -> overdueDays = elapsedDays - loanDays

console.log(buildLoanRows(libraryData))
