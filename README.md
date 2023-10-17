# IML-Visualizer
Load the app by going to the following URL: https://iml-visualizer.vercel.app/
## Usage:
The website automatically loads in sample generations on a sample problem set. To upload your own:
1. Prepare a set of result_sets to visualize. JSONify the pickled result_sets if they are not JSON files already.
2. Upload any result_set to the uploader at the top of the page. This extracts the set of questions from the result_set and fills them in the dropbox.
3. Upload any result_set to either the code editor on the left or right. The code editor will extract the solution code in the result_set and display them in the dropbox.

Note: we assume that the set of. Unwanted behavior may occur if you upload result sets to the code editor that are not correlated with the result set used to extract the questions.
