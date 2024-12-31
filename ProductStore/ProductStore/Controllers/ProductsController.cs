using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Mvc;
using Newtonsoft.Json;
using ProductStore.Models;
using System.IO;
using System.Web;
using System.Text;
using System.Net.Http.Headers;

namespace ProductStore.Controllers
{
    public class ProductsController : ApiController  
    {
        List<dynamic> data = new List<dynamic>();
        public ProductsController()
        {
            for (int i = 1; i < 6; i++)
            {
                var item = new
                {
                    Date = DateTime.Now,
                    Docket = $"Docket {i}",
                    LineNo = $"sadasda {i}",
                    Id = i,
                    EMP = $"Asdasd{i}",
                    Sufix = $"asd{i}",
                    Steps = $"asd{i}",
                    Eligibility = i < 3 ? "C" : i < 4? "B" : "A",
                    Amount = 10m * i,
                    ViewCommented = i < 3 ? true: false
                };
                data.Add(item);
            }
        }

        static readonly IProductRepository repository = new ProductRepository();

        public IEnumerable<Product> GetAllProducts(string EMP = null, string ResponceType = null, bool ViewResponded = false, bool CLosed = false)
        {
            return repository.GetAll().Where( (i) => 
                 i.EMP.Contains(EMP is null ? "" : EMP) &&
                 i.ResponceType.Contains(ResponceType is null ? "" : ResponceType) &&
                 (ViewResponded ? i.ViewResponded == ViewResponded : true) &&
                 (CLosed ? i.CLosed == CLosed : true));
        }

        public IEnumerable<dynamic> GetProduct(int id,string Ammount = null,string Eligibility = "",bool ViewCommented = false)
        {
            return data.Where((i) =>
                 (Ammount is null ? true : (i.Amount == decimal.Parse(Ammount)) || i.Id == decimal.Parse(Ammount))  &&
                 i.Eligibility.Contains(Eligibility is null ? "" : Eligibility) &&
                 (ViewCommented ? i.ViewCommented == ViewCommented : true));
        }

        public IEnumerable<Product> GetProductsByCategory(string category)
        {
            return repository.GetAll().Where(
                p => string.Equals(p.Suffix, category, StringComparison.OrdinalIgnoreCase));
        }

        public HttpResponseMessage PostProduct(Product item)
        {
            var error = validateProduct(item);
            if (error.Count > 0)
            {
                var eresponse = Request.CreateResponse<List<string>>(HttpStatusCode.NotAcceptable, error);
                return eresponse;
            }

            item = repository.Add(item);
            var response = Request.CreateResponse<Product>(HttpStatusCode.Created, item);


            string uri = Url.Link("DefaultApi", new { id = item.Id });
            response.Headers.Location = new Uri(uri);
            return response;
        }

        public HttpResponseMessage PutProduct(int id, Product product)
        {
            product.Id = id;
            return Request.CreateResponse<Product>(HttpStatusCode.OK, product);
        }

        public IEnumerable<dynamic> DeleteProduct(int id)
        {           
            repository.Remove(id);
            return repository.GetAll();
        }
        public IEnumerable<dynamic> DeleteProductDataById(int id)
        {
            var resp = data.RemoveAll((i) => i.Id == id);
            return data;
        }

        //[System.Web.Http.HttpDelete]
        ////[System.Web.Http.HttpPost("DeleteProductData/{id}")]
        //public IEnumerable<dynamic> Data(int id)
        //{
        //    data.RemoveAll( (i) => i.Id = id);
        //    return data;
        //}

        //public HttpResponseMessage GetProductPDF(int id)
        //{
        //    string fullPath = AppDomain.CurrentDomain.BaseDirectory + "/data.pdf";
        //    if (File.Exists(fullPath))
        //    {

        //        HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
        //        var fileStream = new FileStream(fullPath, FileMode.Open);
        //        response.Content = new StreamContent(fileStream);
        //        response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        //        response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
        //        response.Content.Headers.ContentDisposition.FileName = "data.pdf";
        //        return response;
        //    }

        //    return new HttpResponseMessage(HttpStatusCode.NotFound);
        //}

        List<string> validateProduct(Product product)
        {
            List<string> errors = new List<string>();
            //if(product.Name == String.Empty)
            //{
            //    errors.Add("Name cannot be empty");
            //}
            //if (product.Category == String.Empty)
            //{
            //    errors.Add("Category cannot be empty");
            //}
            //if (product.Price < 0 || product.Price > 9999)
            //{
            //    errors.Add("Price must in range 0 to 9999");
            //}
            return errors;
        }
    }
}
