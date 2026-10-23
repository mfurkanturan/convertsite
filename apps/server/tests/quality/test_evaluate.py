import unittest
from evaluate import accuracy, normalized, edit_distance
from scenarios import cases, TOOLS


class AuditIntegrity(unittest.TestCase):
    def test_unicode_and_whitespace_normalization(self):
        self.assertEqual(normalized('I\u0307stanbul  12\n34'), normalized('İstanbul1234'))

    def test_missing_and_changed_critical_digit_reduce_accuracy(self):
        self.assertLess(accuracy('1234.56', '1234.57'), 1)
        self.assertEqual(accuracy('ABC', ''), 0)
        self.assertEqual(accuracy('ABC', 'ABC'), 1)

    def test_every_tool_has_eight_distinct_scenarios(self):
        suite = cases()
        self.assertEqual(len(suite), 120)
        self.assertEqual(len({c['id'] for c in suite}), 120)
        for tool in TOOLS:
            self.assertEqual(sum(c['tool'] == tool for c in suite), 8)

    def test_word_errors_count_insertions_deletions_and_substitutions(self):
        self.assertEqual(edit_distance(['hello','world'],['hello','word']),1)
        self.assertEqual(edit_distance(['hello'],['hello','world']),1)
        self.assertEqual(edit_distance(['hello','world'],['hello']),1)


if __name__ == '__main__': unittest.main()
