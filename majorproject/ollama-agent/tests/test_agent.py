import unittest
from src.agent import run_ai_agent

class TestAgent(unittest.TestCase):
    def test_schedule_meeting(self):
        prompt = "Schedule meeting with Divya at 10am"
        response = run_ai_agent(prompt)
        self.assertIn("Divya", response)
        self.assertIn("10", response)

    def test_send_email(self):
        prompt = "Email report to Alice"
        response = run_ai_agent(prompt)
        self.assertIn("Alice", response)
        self.assertIn("Email", response)

if __name__ == "__main__":
    unittest.main()
