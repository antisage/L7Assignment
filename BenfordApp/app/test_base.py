from base import get_conformity
import unittest

class ChiSquareTest(unittest.TestCase):
    def test_conformity_with_equal_values(self):
        observed = [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6]
        expected_chi_sqr = 0
        self.assertEqual(get_conformity(observed), expected_chi_sqr)

    def test_conformity_with_different_values(self):
        observed = [35, 16.5, 12, 9, 8, 7, 6, 5.5, 4]
        expected_chi_sqr = 0.05
        self.assertLess(get_conformity(observed), expected_chi_sqr)

    def test_conformity_with_high_values(self):
        observed = [405, 16.5, 12, 9, 8, 7, 6, 5.5, 405]
        expected_chi_sqr = 0.05
        self.assertGreater(get_conformity(observed), expected_chi_sqr)

    def test_conformity_with_empty_list(self):
        observed = []
        expected_chi_sqr = 0
        self.assertEqual(get_conformity(observed), expected_chi_sqr)


# class TestGetBenfordAnalysis(unittest.TestCase):

#     def setUp(self):
#         self.app = Flask(__name__)
#         self.client = self.app.test_client()

#     @patch('your_module.pd.DataFrame', return_value=DataFrame())
#     @patch('your_module.get_conformity', return_value=42)
#     @patch('your_module.request')
#     def test_get_benford_analysis(self, mock_request, mock_get_conformity, mock_dataframe):
#         # Prepare test data
#         test_data = [
#             {'params': 123},
#             {'params': 456},
#             {'params': 789},
#             {'params': 'invalid'},
#             {'params': '123'},
#             {'params': '456'}
#         ]
        
#         # Mock the necessary dependencies
#         mock_request.get_json.return_value = test_data
        
#         # Call the function
#         with self.app.test_request_context():
#             response = get_benford_analysis()

#         # Validate the result
#         expected_result = {'numRows': 3, 'dist': [0, 0, 0, 0, 0, 0, 0, 0, 0], 'chisqr': 42}
#         self.assertEqual(response.get_json(), expected_result)
#         self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
