package com.nextrack.dao;

import com.nextrack.model.Producto;
import com.nextrack.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class ProductoDAO {

    // Método para insertar un nuevo producto (Lo usa el Admin)
    public void guardarProducto(Producto producto) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.persist(producto);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }

    // Método para buscar un producto por su ID (Necesario para validar stock)
    public Producto obtenerProducto(int idProducto) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.get(Producto.class, idProducto);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Método para actualizar el producto (Cuando cambia el stock)
    public void actualizarProducto(Producto producto) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.merge(producto);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }
    // Método para traer la lista completa de productos desde la BD
    public java.util.List<Producto> listarProductos() {
    try (Session session = HibernateUtil.getSessionFactory().openSession()) {
        // HQL consulta la clase Producto
        return session.createQuery("FROM Producto", Producto.class).list();
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}
}