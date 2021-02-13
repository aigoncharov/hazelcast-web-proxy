package x;

public class Rot13 {

    /* Rot13
     */
    public static String encode(String input) {
        StringBuilder stringBuilder = new StringBuilder(input.length());
        
        for (int i = 0 ; i < input.length(); i++) {
            char c = input.charAt(i);

            if (('a' <= c && c <= 'm') || ('A' <= c && c <= 'M')) {
                c += 13;
            } else {
                if (('n' <= c && c <= 'z') || ('N' <= c && c <= 'Z')) {
                    c -= 13;
                }
            }
            stringBuilder.append(c);
        }
        
        return stringBuilder.toString();
    }
}
