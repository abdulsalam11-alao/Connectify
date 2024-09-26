import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styled from "styled-components";

// Styled Components
const SupportContainer = styled.div`
  margin: 2rem auto;
  padding: 2rem;
  max-width: 800px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  margin-bottom: 2rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Card = styled.div`
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
`;

const BodyText = styled.p`
  margin: 0.5rem 0;
`;

const Icon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const Button = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const AccordionContainer = styled.div`
  margin-bottom: 1rem;
`;

const AccordionItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const AccordionHeader = styled.div<{ isOpen: boolean }>`
  padding: 1rem;
  background-color: #f1f1f1;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #e1e1e1;
  }
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  padding: 1rem;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

// Support Page Component
const SupportPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I reset my password?",
      answer:
        "To reset your password, go to the login page and click on 'Forgot Password.'",
    },
    {
      question: "How can I contact support?",
      answer: "You can reach out to us via email or phone (details below).",
    },
    {
      question: "Where can I find the terms and conditions?",
      answer:
        "You can find the terms and conditions in the footer of the website.",
    },
  ];

  return (
    <SupportContainer>
      <BackButton onClick={() => navigate(-1)}>Back</BackButton>{" "}
      {/* Back Button */}
      <Title>Support Page</Title>
      <Grid>
        {/* FAQ Section */}
        <Card>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <AccordionContainer>
            {faqs.map((faq, index) => (
              <AccordionItem key={index}>
                <AccordionHeader
                  isOpen={openIndex === index}
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{faq.question}</span>
                  <span>{openIndex === index ? "-" : "+"}</span>
                </AccordionHeader>
                <AccordionContent isOpen={openIndex === index}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionContainer>
        </Card>

        {/* Contact Information Section */}
        <Card>
          <SectionTitle>Contact Us</SectionTitle>
          <BodyText>
            <Icon>📧</Icon> Email: abdulsalamalao89@gmail.com
          </BodyText>
          <BodyText>
            <Icon>📞</Icon> Phone: +234 7025 529 423
          </BodyText>
          <BodyText>
            <Icon>💬</Icon> Live Chat: Available on our website.
          </BodyText>
          <Button href="mailto:support@example.com">Email Support</Button>
        </Card>
      </Grid>
    </SupportContainer>
  );
};

export default SupportPage;
