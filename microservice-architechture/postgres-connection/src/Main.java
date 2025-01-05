import java.sql.*;

public class Main {

public static void main(String[] args) throws SQLException, ClassNotFoundException {
    Class.forName("org.postgresql.Driver");
    String url = "jdbc:postgresql://localhost:5432/test_jdbc?user=postgres&password=Alp01011997&ssl=false";
    Connection conn = DriverManager.getConnection(url);

    PreparedStatement p= conn.prepareStatement("select * from topic");
    ResultSet rs= p.executeQuery();
    while (rs.next()){
        int id= rs.getInt("id");
        String name= rs.getString("name");
        System.out.println("ID: " + id + " Name: " + name);
    }

}
}