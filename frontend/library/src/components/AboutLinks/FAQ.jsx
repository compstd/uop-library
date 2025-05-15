import { Col } from "react-bootstrap";
import "./FAQ.css";
import { useState } from "react";
import Heading from "./Heading";
const faqs = [
  {
    title: "How can I get a library membership card?",
    text: `
      To get a library membership card, follow these steps:
      1. Fill out the library registration form available at the library or online.
      2. Submit the form along with any required documentation, such as an attested form from your department head.
      3. The library will issue a non-transferable membership card upon approval.
      4. Report immediately to the circulation desk if you lose the card. A duplicate card can be obtained for PKR 500.
    `,
  },
  {
    title: "Who is eligible for library membership?",
    text: `
      The following categories are eligible for membership:
      1. Students: Regular BS, MA/MSc, MPhil/MS, and PhD scholars.
      2. Faculty and Staff: Regular, contractual, and visiting faculty, along with administrative staff.
      3. Temporary Members: UoP alumni, researchers, and postgraduate students from other universities.
    `,
  },
  {
    title: "Is there a fee for library membership?",
    text: `
      1. Regular students and faculty: Membership is free.
      2. Temporary members: A quarterly registration fee of PKR 6,000 is required.
      3. Duplicate card fee: PKR 500 for lost cards.
    `,
  },
  {
    title: "What is the process to borrow books from the library?",
    text: `
      To borrow books:
      1. Present your membership card at the circulation desk.
      2. Request the desired books (limited to two books per user).
      3. Borrowed books can be kept for up to 21 days.
      4. Collect a return slip as proof when returning books.
    `,
  },
  {
    title: "Can I reserve a book if it’s already borrowed?",
    text: `
      Yes, you can reserve a borrowed book by requesting library staff to add your name to the reservation list.
      1. You will be notified via email when the book becomes available.
      2. Books can only be reissued if no reservation is pending.
    `,
  },
  {
    title: "What should I do if I lose a borrowed book?",
    text: `
      If you lose a book:
      1. Report the loss immediately to the library staff.
      2. Replace the book with the same edition or pay three times the current market price along with a PKR 500 processing fee.
    `,
  },
  {
    title: "Are there any restrictions on borrowing books?",
    text: `
      Yes, the following rules apply:
      1. Books can only be issued to the cardholder.
      2. Reference material like dictionaries and encyclopedias cannot be borrowed but can be used within the library.
      3. A book can be renewed once unless another user has reserved it.
    `,
  },
  {
    title: "What are the library's operating hours?",
    text: `
      The University of Peshawar Library is open from 8:00 AM to 7:00 PM, Monday through Friday.
    `,
  },
  {
    title: "What is prohibited inside the library?",
    text: `
      The following activities are not allowed:
1 .Eating, drinking, sleeping, or smoking.
2 .Mobile phone conversations (phones must be on silent; SMS is allowed)
   Misconduct with staff or disturbing other users.
3 . Turning on/off electric or IT equipment.
4 .Changing furniture arrangements or taking photographs without permission.
    `,
  },
  {
    title: "Is library Membership card and university student Card same?",
    text: `
      Yes, Student card and library membership card are same and can be used everywhere in university as well as in library.
    `,
  },
];

export default function FAQ() {
  const [isOpen, setIsOpen] = useState(null);
  return (
    <Col md={8} className="px-4">
      <Heading heading="Frequently Asked Questions" />
      <div className="accordions mt-5 mb-5">
        {faqs.map((ques, i) => (
          <AccordianItem
            title={ques.title}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            text={ques.text}
            num={i}
            key={ques.title}
          />
        ))}
      </div>
    </Col>
  );
}

function AccordianItem({ title, text, num, isOpen, setIsOpen }) {
  const checkOpen = num === isOpen;
  function handleClick() {
    setIsOpen(checkOpen ? "null" : num);
  }

  // Split the answer text into individual lines
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className={`ques ${checkOpen ? "open" : ""}`} onClick={handleClick}>
      <div className="num">{num < 9 ? `0${num + 1}` : num + 1}</div>
      <div className="titles">{title}</div>
      <p className="iconed">{isOpen ? "+" : ""}</p>
      {checkOpen && (
        <div className="content-box">
          {lines.map((line, index) => (
            <p key={index} className="line-item">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
