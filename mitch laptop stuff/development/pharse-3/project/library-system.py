import sqlite3
import random

class Library:
    def __init__(self):
        # Establish a connection to the SQLite database (it will be created if it doesn't exist)
        self.conn = sqlite3.connect('library.db')
        self.cursor = self.conn.cursor()
        
        # Create the necessary tables if they don't already exist
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS books (name TEXT, status TEXT)''')
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS track (student_name TEXT, book_name TEXT)''')

        # Initialize the library with predefined books
        self.initialize_books()

    def initialize_books(self):
        # List of popular books from various genres (20 books initially)
        popular_books = [
            ("The Seven Husbands of Evelyn Hugo", "available"),
            ("Where the Crawdads Sing", "available"),
            ("The Midnight Library", "available"),
            ("Circe", "available"),
            ("The Song of Achilles", "available"),
            ("Educated", "available"),
            ("Becoming", "available"),
            ("Atomic Habits", "available"),
            ("The Body Keeps the Score", "available"),
            ("Sapiens: A Brief History of Humankind", "available"),
            ("The Silent Patient", "available"),
            ("The Last House on Needless Street", "available"),
            ("The Couple Next Door", "available"),
            ("The Priory of the Orange Tree", "available"),
            ("Project Hail Mary", "available"),
            ("The House in the Cerulean Sea", "available"),
            ("Big Little Lies", "available"),
            ("Normal People", "available"),
            ("The Night Circus", "available"),
            ("Little Fires Everywhere", "available")
        ]
        
        # Select only 10 books from the available list (by removing the first 20)
        selected_books = random.sample(popular_books, 10)  # Selecting 10 random books

        # Insert the selected 10 books into the database if they are not already present
        for book in selected_books:
            # Check if the book already exists before inserting
            self.cursor.execute("SELECT * FROM books WHERE name = ?", (book[0],))
            existing_book = self.cursor.fetchone()
            if not existing_book:
                self.cursor.execute('''INSERT INTO books (name, status) VALUES (?, ?)''', book)
        
        # Commit changes to the database
        self.conn.commit()

    def displayAvailableBooks(self):
        # Fetch all books that are available
        self.cursor.execute("SELECT name FROM books WHERE status = 'available'")
        books = self.cursor.fetchall()

        print(f"\n{len(books)} AVAILABLE BOOKS ARE: ")
        for book in books:
            print(" ♦-- " + book[0])
        print("\n")

    def borrowBook(self, name, bookname):
        # Check if the book is available
        self.cursor.execute("SELECT * FROM books WHERE name = ? AND status = 'available'", (bookname,))
        book = self.cursor.fetchone()

        if not book:
            print(f"{bookname} BOOK IS NOT AVAILABLE EITHER TAKEN BY SOMEONE ELSE, WAIT UNTIL HE RETURNS.\n")
        else:
            # Add the book to the track table
            self.cursor.execute("INSERT INTO track (student_name, book_name) VALUES (?, ?)", (name, bookname))
            # Mark the book as 'borrowed'
            self.cursor.execute("UPDATE books SET status = 'borrowed' WHERE name = ?", (bookname,))
            self.conn.commit()
            print("BOOK ISSUED: THANK YOU, KEEP IT WITH CARE AND RETURN ON TIME.\n")

    def returnBook(self, bookname):
        # Check if the book is being returned by the student
        self.cursor.execute("SELECT student_name FROM track WHERE book_name = ?", (bookname,))
        student = self.cursor.fetchone()

        if student:
            # Remove the book from the track table
            self.cursor.execute("DELETE FROM track WHERE book_name = ?", (bookname,))
            # Mark the book as 'available'
            self.cursor.execute("UPDATE books SET status = 'available' WHERE name = ?", (bookname,))
            self.conn.commit()
            print("BOOK RETURNED: THANK YOU!\n")
        else:
            print("No such book is currently issued.\n")

    def donateBook(self, bookname):
        # Add donated book to the library as available
        self.cursor.execute("INSERT INTO books (name, status) VALUES (?, 'available')", (bookname,))
        self.conn.commit()
        print("BOOK DONATED: THANK YOU VERY MUCH, HAVE A GREAT DAY AHEAD.\n")

    def deleteBook(self, bookname):
        # Check if the book exists in the library
        self.cursor.execute("SELECT * FROM books WHERE name = ?", (bookname,))
        book = self.cursor.fetchone()

        if book:
            # Remove the book from the books table
            self.cursor.execute("DELETE FROM books WHERE name = ?", (bookname,))
            # If the book was borrowed, also remove from the track table
            self.cursor.execute("DELETE FROM track WHERE book_name = ?", (bookname,))
            self.conn.commit()
            print(f"BOOK {bookname} DELETED SUCCESSFULLY.\n")
        else:
            print(f"BOOK {bookname} DOES NOT EXIST IN THE LIBRARY.\n")


class Student:
    def requestBook(self):
        print("So, you want to borrow a book!")
        self.book = input("Enter name of the book you want to borrow: ")
        return self.book

    def returnBook(self):
        print("So, you want to return a book!")
        name = input("Enter your name: ")
        self.book = input("Enter name of the book you want to return: ")
        return self.book

    def donateBook(self):
        print("Okay! you want to donate a book!")
        self.book = input("Enter name of the book you want to donate: ")
        return self.book


if __name__ == "__main__":

    # Create the library instance (MoneykicksLib) and student instance
    MoneykicksLib = Library()
    student = Student()

    print("   ♦♦♦♦♦♦♦ WELCOME TO THE MONEYKICKS LIBRARY ♦♦♦♦♦♦♦\n")
    print("""CHOOSE WHAT YOU WANT TO DO:-\n1. Listing all books\n2. Borrow books\n3. Return books\n4. Donate books\n5. Track books\n6. Delete a book\n7. exit the library\n""")

    while True:
        try:
            usr_response = int(input("Enter your choice: "))

            if usr_response == 1:  # listing
                MoneykicksLib.displayAvailableBooks()
            elif usr_response == 2:  # borrow
                MoneykicksLib.borrowBook(
                    input("Enter your name: "), student.requestBook())
            elif usr_response == 3:  # return
                MoneykicksLib.returnBook(student.returnBook())
            elif usr_response == 4:  # donate
                MoneykicksLib.donateBook(student.donateBook())
            elif usr_response == 5:  # track
                # Fetch and display all borrowed books
                MoneykicksLib.cursor.execute("SELECT student_name, book_name FROM track")
                borrowed_books = MoneykicksLib.cursor.fetchall()

                if borrowed_books:
                    for student_name, book_name in borrowed_books:
                        print(f"{book_name} book is taken/issued by {student_name}.")
                else:
                    print("NO BOOKS ARE ISSUED!\n")
            elif usr_response == 6:  # delete book
                book_name_to_delete = input("Enter the name of the book to delete: ")
                MoneykicksLib.deleteBook(book_name_to_delete)
            elif usr_response == 7:  # exit
                print("THANK YOU FOR VISITING THE MONEYKICKS LIBRARY!\n")
                break
            else:
                print("INVALID INPUT!\n")
        except Exception as e:  # catch errors
            print(f"{e}---> INVALID INPUT!\n")
