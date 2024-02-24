import difflib

def find_typos(original_text, text_to_check):
    """
    Finds typos in the text_to_check by comparing it with the original_text.
    """
    # Split the text into words
    original_words = original_text.split()
    check_words = text_to_check.split()

    # Initialize a list to store typos
    typos = []

    # Iterate through each word in the text_to_check
    for word in check_words:
        # Check if the word is in the original text
        if word not in original_words:
            # Find similar words in the original text using difflib
            similar_words = difflib.get_close_matches(word, original_words)
            if similar_words:
                typos.append((word, similar_words))

    return typos

# Example usage
original_text = "the quick brown fox jumps over the lazy dog."
text_to_check = "The brown quikc fox jumps over the lay dog."
typos = find_typos(original_text.lower(), text_to_check.lower())

if typos:
    print("Typos found:")
    for typo in typos:
        print(f"Word: {typo[0]}, Similar words in original text: {typo[1]}")
else:
    print("No typos found.")
